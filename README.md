# TRINETRA

TRINETRA is a public-infrastructure monitoring platform for MPLADS work records. It combines a React dashboard, a FastAPI data service, a relational database, and a scikit-learn risk-assessment service.

## What the project does

- **Citizens** can browse public works, inspect project details, and submit issues or feedback.
- **Government users** can review project portfolios, regional analytics, investigations, and risk indicators.
- **Contractors** can view contractor and project information.
- **The AI assessment page** accepts project attributes and returns cost, expenditure, progress, delay, and duplicate-work anomaly probabilities.

## Architecture

```mermaid
flowchart LR
		U[Browser] --> F[React + Vite frontend\nlocalhost:5173]
		F -->|/api requests| B[FastAPI backend\nlocalhost:5000]
		B --> D[(PostgreSQL database)]
		B --> R[Risk model service]
		R --> M[(joblib model bundle)]
		R --> DS[data/mplads_data.csv]
		CSV[data/*.csv] --> I[import_data.py]
		I --> D
```

### Request pipeline

1. A page in `frontend/src` calls a service such as `governmentService.js` or `projectService.js`.
2. `frontend/src/services/api.js` sends the request to `/api`. During Vite development, the proxy forwards `/api` to `http://127.0.0.1:5000`.
3. FastAPI routes in `backend/app/main.py` validate query parameters, open a SQLAlchemy session, and query the database models.
4. The backend converts database rows into the JSON shape expected by the dashboard. Project status and display risk are derived from the stored work status.
5. The browser renders the response in the relevant dashboard page.

### AI assessment pipeline

The government AI Assessment page posts a complete project record to:

```text
POST /api/government/ai-assessment
```

The payload contains categorical fields such as `category`, `state`, `district`, `agency_name`, and `status`, date fields, financial values, progress, and coordinates. The backend then:

1. Checks that all fields in `INPUTS` are present.
2. Converts numeric fields to `float`.
3. Parses dates and derives year, month, day, weekday, duration, utilization, release, expenditure, and cost-difference features.
4. One-hot encodes categorical values.
5. Loads `backend/saved_models/mplads_risk_bundle.joblib` when it exists.
6. Otherwise trains five balanced logistic-regression models from `data/mplads_data.csv`, using a `StandardScaler` for each target, and saves the bundle.
7. Reindexes the request features to the training feature columns, calculates probabilities, and returns the detected anomalies plus a maximum-probability net risk level.

The five model targets are:

| Target | Meaning |
| --- | --- |
| `is_cost_anomaly` | Estimated and sanctioned cost anomaly |
| `is_exp_anomaly` | Expenditure anomaly |
| `is_progress_anomaly` | Physical progress anomaly |
| `is_delay` | Delivery delay risk |
| `is_duplicate` | Duplicate-work risk |

The separate `/api/government/risk-monitor` and `/api/government/risk-scan` endpoints currently calculate dashboard indicators from database work status. They do not invoke the trained anomaly models.

## Repository layout

```text
backend/
	app/
		main.py          FastAPI routes and response shaping
		database.py      SQLAlchemy engine and database sessions
		models.py        SQLAlchemy table definitions
		risk_model.py    Feature preparation and AI assessment
	create_tables.py   Creates tables from SQLAlchemy metadata
	import_data.py     Truncates and imports CSV data
	.env               Local backend configuration
	saved_models/      Generated joblib model bundle
data/                Source CSV files and model training data
frontend/
	src/pages/         React page components
	src/services/      API, project, government, and auth clients
	src/context/       Authentication and theme state
	.env               Vite environment configuration
```

## Prerequisites

- Windows PowerShell, or an equivalent shell
- Python 3.10 or newer
- Node.js and npm
- PostgreSQL running locally or remotely
- A PostgreSQL database matching `DATABASE_URL`

The repository currently does not contain `requirements.txt` or `pyproject.toml`. The backend virtual environment must therefore already contain the imports used by the application, including FastAPI, Uvicorn, SQLAlchemy, psycopg2, python-dotenv, pandas, numpy, scikit-learn, and joblib.

## Configuration

Create or update `backend/.env`:

```env
DATABASE_URL=postgresql+psycopg2://postgres:your_password@localhost:5432/trinetra
```

The frontend reads `frontend/.env`:

```env
VITE_API_URL=/api
VITE_FIREBASE_API_KEY=your_firebase_web_api_key
VITE_FIREBASE_EMAIL_ROLE_MAP={"gov.officer@test.com":"government","constructor.builder@test.com":"contractor","user@test.com":"citizen"}
```

The current frontend also includes a local government demo account:

```text
Email: gov.admin@trinetra.gov.in
Password: Trinetra@2026
```

This demo account is handled in the frontend and is separate from Firebase authentication. Do not use it as production authentication.

## Database setup and data loading

From the project root:

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python create_tables.py
python import_data.py
```

`create_tables.py` creates the tables defined in `backend/app/models.py`. `import_data.py` then truncates the existing imported tables and loads the Lok Sabha CSV files into:

- `works_recommended`
- `works_sanctioned`
- `works_completed`
- `expenditures`
- `mps`
- `calamities`

The import script uses absolute `C:\TriNetra\data` paths and is therefore tied to the current Windows project location. It also removes summary rows, trims text, and converts currency columns to numeric values.

Useful checks:

```powershell
python check_data.py
python check_expenditure.py
```

## Running the application

### Backend

```powershell
cd backend
.\venv\Scripts\Activate.ps1
.\venv\Scripts\uvicorn.exe app.main:app --reload --port 5000
```

Backend URLs:

- Health check: `http://localhost:5000/api/health`
- Swagger documentation: `http://localhost:5000/docs`

### Frontend

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

The convenience script `start-trinetra.bat` starts both services in separate PowerShell windows.

## API overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Database connectivity and row counts |
| `GET` | `/api/projects/meta` | Districts, categories, and statuses |
| `GET` | `/api/projects` | Filtered and paginated project records |
| `GET` | `/api/projects/{id}` | Project detail; IDs use `SAN-123` or `COM-123` |
| `GET` | `/api/government/overview` | Government KPIs, regional monitoring, activity, and attention items |
| `GET` | `/api/government/analytics` | Performance and budget analytics |
| `GET` | `/api/government/risk-monitor` | Current status-based risk list |
| `POST` | `/api/government/risk-scan` | Recalculates the status-based risk list with a timestamp |
| `GET` | `/api/government/investigations` | Pending sanctioned works presented as investigations |
| `GET` | `/api/contractors` | Contractor summary records derived from sanctioned works |
| `POST` | `/api/government/ai-assessment` | Runs the trained anomaly assessment models |

## Authentication

Authentication is currently frontend-controlled:

- Firebase sign-in is performed through the Firebase Identity Toolkit REST endpoint.
- A Firebase user must be listed in `VITE_FIREBASE_EMAIL_ROLE_MAP` or `VITE_FIREBASE_ROLE_MAP` to receive a dashboard role.
- The local demo government credentials bypass Firebase and return a government user directly.
- A remembered session is stored in browser `localStorage` under `trinetra.auth.remember`.

This is suitable for a demonstration environment, not production access control. Production deployment should validate Firebase tokens in the backend and enforce authorization on API routes.

## Model training and replacement

The model bundle is generated lazily on the first AI assessment if it does not already exist. To force a rebuild, remove:

```text
backend/saved_models/mplads_risk_bundle.joblib
```

Then submit a new assessment. The input column names and target columns must remain compatible with `backend/app/risk_model.py`. The training dataset must contain all entries in `INPUTS` plus the five target columns.

## Troubleshooting

### Frontend says it cannot reach the API

Confirm the backend is running on port 5000 and that the frontend is running through Vite. The Vite proxy only forwards `/api` requests in development.

### Backend fails during startup

Check `DATABASE_URL`, confirm PostgreSQL is running, and verify the database exists. Then run `python create_tables.py` before importing data.

### Dashboard has zero records

Run `python import_data.py` from `backend` and check `http://localhost:5000/api/health`.

### AI assessment fails

Make sure every form field is populated, the training CSV exists at `data/mplads_data.csv`, and the backend environment contains pandas, numpy, scikit-learn, and joblib.

### Firebase login succeeds but redirects to login

Add the exact lowercase Firebase email and its role to `VITE_FIREBASE_EMAIL_ROLE_MAP`, restart Vite, and clear the remembered browser session.

## Development notes

- The backend is read-oriented for project and government reporting; the current API does not expose general database write endpoints.
- Status-based dashboard risk is an interpreted view of MPLADS records, not the trained anomaly model output.
- `frontend/src/services/aiService.js` contains older `/api/ai/*` helper paths. The active government assessment page calls `/api/government/ai-assessment` directly.