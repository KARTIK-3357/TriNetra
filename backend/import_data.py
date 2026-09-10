import pandas as pd
from sqlalchemy import text
from app.database import engine

BASE = r"C:\TriNetra\data"

TABLES = [
    "calamities",
    "expenditures",
    "works_completed",
    "works_sanctioned",
    "works_recommended",
    "mps",
]


def truncate_tables():
    with engine.begin() as conn:
        for table in TABLES:
            conn.execute(text(f'TRUNCATE TABLE "{table}" RESTART IDENTITY CASCADE'))


def load_csv(filename, table_name, column_map):
    path = f"{BASE}\\{filename}"

    print(f"\n{'=' * 60}")
    print(f"Loading: {filename} -> {table_name}")

    df = pd.read_csv(path, low_memory=False)
    df = df.rename(columns=column_map)
    df = df[[col for col in column_map.values() if col in df.columns]]

    # Drop summary rows like "Grand Total" that appear at the end of CSVs
    if "id" in df.columns:
        df["id"] = pd.to_numeric(df["id"], errors="coerce")
        dropped = df["id"].isna().sum()
        if dropped:
            print(f"Dropped {dropped} non-data row(s)")
        df = df.dropna(subset=["id"])
        df["id"] = df["id"].astype(int)

    for col in df.columns:
        if df[col].dtype == "object":
            df[col] = df[col].astype(str).str.strip()
            df[col] = df[col].replace("nan", None)

    numeric_columns = [
        "recommended_amount",
        "sanction_amount",
        "amount_disbursed",
        "fund_disbursed_amount",
        "allocated_amount",
        "consent_amount",
    ]

    for col in numeric_columns:
        if col in df.columns:
            df[col] = pd.to_numeric(
                df[col].astype(str).str.replace(",", "", regex=False),
                errors="coerce",
            )

    print(f"Rows: {len(df):,}")
    print(f"Columns: {list(df.columns)}")

    df.to_sql(
        table_name,
        engine,
        if_exists="append",
        index=False,
        chunksize=500,
        method="multi",
    )

    print(f"SUCCESS: {table_name}")


print("Truncating existing tables...")
truncate_tables()

load_csv(
    "WorksRecommendedLokSabha.csv",
    "works_recommended",
    {
        "Sr. No.": "id",
        "Work category": "work_category",
        "WORK": "work",
        "State": "state",
        "IDA": "ida",
        "Hon'ble Members of Parliament": "mp_name",
        "Constituency": "constituency",
        "Work description": "work_description",
        "Recommended date": "recommended_date",
        "RECOMMENDED AMOUNT   ( ₹ )": "recommended_amount",
    },
)

load_csv(
    "Works Sanctioned.csv",
    "works_sanctioned",
    {
        "Sr. No.": "id",
        "Work category": "work_category",
        "Work": "work",
        "State": "state",
        "IDA": "ida",
        "Hon'ble Members of Parliament": "mp_name",
        "Constituency": "constituency",
        "Work description": "work_description",
        "Recommended date": "recommended_date",
        "Sanction Date": "sanction_date",
        "Sanction Amount ( ₹ )": "sanction_amount",
        "Work Status": "work_status",
    },
)

load_csv(
    "WorksCompletedLokSabha.csv",
    "works_completed",
    {
        "Sr. No.": "id",
        "Work Category": "work_category",
        "Work": "work",
        "State": "state",
        "IDA": "ida",
        "Work Description": "work_description",
        "Hon'ble Members of Parliament": "mp_name",
        "Constituency": "constituency",
        "Image": "image",
        "Completion Date": "completion_date",
        "Amount Disbursed ( ₹ )": "amount_disbursed",
    },
)

load_csv(
    "expenditureLokSabha.csv",
    "expenditures",
    {
        "Sr. No.": "id",
        "State": "state",
        "Work": "work",
        "Work ID": "work_id",
        "IDA": "ida",
        "Hon'ble Members of Parliament": "mp_name",
        "Constituency": "constituency",
        "Expenditure Date": "expenditure_date",
        "Vendor Name": "vendor_name",
        "Payment Status": "payment_status",
        "Fund Disbursed Amount ( ₹ )": "fund_disbursed_amount",
    },
)

load_csv(
    "mpAllocationLokSabha.csv",
    "mps",
    {
        "Sr. No.": "id",
        "State": "state",
        "Hon'ble Members of Parliaments": "name",
        "Constituency": "constituency",
        "Allocated AMOUNT ( ₹ )": "allocated_amount",
    },
)

load_csv(
    "CalamityLokSabha.csv",
    "calamities",
    {
        "Sr. No.": "id",
        "Calamity Type": "calamity_type",
        "Calamity Name": "calamity_name",
        "Hon'ble Members of Parliament": "mp_name",
        "Date of Consent": "date_of_consent",
        "Consent Amount ( ₹ )": "consent_amount",
    },
)

print("\n")
print("=" * 60)
print("ALL LOK SABHA DATA IMPORTED SUCCESSFULLY!")
print("=" * 60)
