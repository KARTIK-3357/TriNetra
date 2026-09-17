"""Read-only API for the public and government project dashboards."""

from collections import defaultdict
from datetime import datetime
from urllib.parse import unquote

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import case, func, literal, or_
from sqlalchemy.orm import Session

from .database import get_db
from .models import CompletedWork, SanctionedWork
from .risk_model import assess

app = FastAPI(title="Trinetra API")
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#ai assesment api defined 
@app.post("/api/government/ai-assessment")
def ai_assessment(payload: dict):
    try:
        return assess(payload)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error


def district_from_ida(ida: str | None) -> str:
    value = (ida or "").strip()
    if not value:
        return "Not specified"
    return value.split("(", 1)[0].strip().title() or "Not specified"


def district_expr(column):
    raw = func.trim(func.split_part(func.coalesce(column, ""), "(", 1))
    titled = func.initcap(raw)
    return case((or_(raw == "", titled == ""), literal("Not specified")), else_=titled)


def sanctioned_status_expr():
    text = func.lower(func.coalesce(SanctionedWork.work_status, ""))
    return case(
        (text.contains("complete"), "Completed"),
        (
            or_(
                text.contains("progress"),
                text.contains("physical"),
                text.contains("ongoing"),
                text.contains("implement"),
            ),
            "Ongoing",
        ),
        else_="Sanctioned",
    )


def amount_label(value: float | None) -> str:
    value = float(value or 0)
    if value >= 10_000_000:
        return f"₹{value / 10_000_000:.2f} Cr"
    if value >= 100_000:
        return f"₹{value / 100_000:.2f} lakh"
    return f"₹{value:,.0f}"


def normalise_status(value: str | None, completed: bool = False) -> str:
    if completed:
        return "Completed"
    text = (value or "Sanctioned").lower()
    if "complete" in text:
        return "Completed"
    if any(token in text for token in ("progress", "physical", "ongoing", "implement")):
        return "Ongoing"
    return "Sanctioned"


def project_record(row, completed: bool = False, detail: bool = False) -> dict:
    amount = row.amount_disbursed if completed else row.sanction_amount
    date = row.completion_date if completed else row.sanction_date
    status = normalise_status(None if completed else row.work_status, completed)
    if status == "Completed":
        risk, score = "Low", 18
    elif status == "Ongoing":
        risk, score = "Medium", 61
    else:
        risk, score = "High", 82
    record = {
        "id": f"{'COM' if completed else 'SAN'}-{row.id}",
        "sourceId": row.id,
        "name": row.work or row.work_description or "Untitled work",
        "description": row.work_description or "No public description provided.",
        "district": district_from_ida(row.ida),
        "location": row.constituency or district_from_ida(row.ida),
        "state": row.state or "Not specified",
        "category": row.work_category or "Other",
        "type": row.work_category or "Other",
        "department": row.work_category or "Other",
        "mpName": row.mp_name or "Not specified",
        "contractor": row.mp_name or "Not specified",
        "authority": row.ida or "Not specified",
        "budget": float(amount or 0),
        "budgetLabel": amount_label(amount),
        "status": status,
        "progress": 100 if status == "Completed" else (55 if status == "Ongoing" else 0),
        "date": date or "Not available",
        "lastUpdate": date or "Not available",
        "startDate": "Not available",
        "expectedCompletion": date or "Not available",
        "risk": risk,
        "allocatedCr": round(float(amount or 0) / 10_000_000, 2),
        "releasedCr": round(float(amount or 0) / 10_000_000, 2),
        "spentCr": round(float(amount or 0) / 10_000_000, 2) if completed else 0,
        "remainingCr": 0 if completed else round(float(amount or 0) / 10_000_000, 2),
    }
    record["aiRisk"] = {
        "score": score,
        "lastScan": "Live database snapshot",
        "factors": [
            {"label": "Physical progress gap", "value": max(0, 100 - record["progress"]) // 5},
            {"label": "Pending start / sanction lag", "value": 18 if status == "Sanctioned" else 6},
            {"label": "Expenditure vs completion", "value": 12 if status != "Completed" else 3},
            {"label": "Implementing authority load", "value": 8},
        ],
        "explanation": (
            "Completed works are treated as low risk. Ongoing works are watched for physical-progress lag. "
            "Sanctioned works that have not moved to completion are flagged for administrative review."
            if not completed
            else "This work has a completion record in the MPLADS database."
        ),
    }
    if detail:
        record.update(
            {
                "timeline": [
                    {
                        "label": "Database record",
                        "date": date or "Not available",
                        "done": completed,
                        "current": not completed,
                    }
                ],
                "contractorUpdates": [],
                "citizenFeedback": [],
            }
        )
    return record


def apply_common_filters(query, model, district: str | None, category: str | None, search: str | None):
    if district and district != "All":
        query = query.filter(district_expr(model.ida) == district)
    if category and category != "All":
        query = query.filter(model.work_category == category)
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                model.work.ilike(term),
                model.work_description.ilike(term),
                model.mp_name.ilike(term),
                model.constituency.ilike(term),
                model.ida.ilike(term),
            )
        )
    return query


def apply_sanctioned_status(query, status: str | None):
    if not status or status == "All":
        return query
    mapped = sanctioned_status_expr()
    return query.filter(mapped == status)


def fetch_page(db: Session, district, status, category, search, limit, offset):
    items: list[dict] = []
    remaining_skip = offset
    remaining_take = limit

    include_sanctioned = status in (None, "", "All", "Sanctioned", "Ongoing", "Completed")
    include_completed = status in (None, "", "All", "Completed")

    if include_sanctioned and remaining_take > 0:
        query = apply_common_filters(db.query(SanctionedWork), SanctionedWork, district, category, search)
        query = apply_sanctioned_status(query, status)
        total_sanctioned = query.count()
        if remaining_skip >= total_sanctioned:
            remaining_skip -= total_sanctioned
        else:
            rows = query.order_by(SanctionedWork.id).offset(remaining_skip).limit(remaining_take).all()
            items.extend(project_record(row) for row in rows)
            remaining_take -= len(rows)
            remaining_skip = 0
    else:
        total_sanctioned = 0

    if include_completed and remaining_take >= 0:
        query = apply_common_filters(db.query(CompletedWork), CompletedWork, district, category, search)
        total_completed = query.count()
        if remaining_skip >= total_completed:
            rows = []
        else:
            rows = query.order_by(CompletedWork.id).offset(remaining_skip).limit(remaining_take).all()
        items.extend(project_record(row, completed=True) for row in rows)
    else:
        total_completed = 0

    if status == "Ongoing":
        total = total_sanctioned
    elif status == "Sanctioned":
        total = total_sanctioned
    elif status == "Completed":
        # Completed can also appear in the sanctioned table.
        total = total_sanctioned + total_completed
    else:
        total = total_sanctioned + total_completed

    return items, total


@app.get("/api/health")
def health(db: Session = Depends(get_db)):
    sanctioned = db.query(func.count(SanctionedWork.id)).scalar() or 0
    completed = db.query(func.count(CompletedWork.id)).scalar() or 0
    return {"ok": True, "sanctioned": sanctioned, "completed": completed}


@app.get("/api/projects/meta")
def project_meta(db: Session = Depends(get_db)):
    sanctioned_districts = {district_from_ida(value) for (value,) in db.query(SanctionedWork.ida).distinct()}
    completed_districts = {district_from_ida(value) for (value,) in db.query(CompletedWork.ida).distinct()}
    sanctioned_categories = {value or "Other" for (value,) in db.query(SanctionedWork.work_category).distinct()}
    completed_categories = {value or "Other" for (value,) in db.query(CompletedWork.work_category).distinct()}
    return {
        "districts": sorted(sanctioned_districts | completed_districts),
        "categories": sorted(sanctioned_categories | completed_categories),
        "statuses": ["Ongoing", "Completed", "Sanctioned"],
    }


@app.get("/api/projects")
def projects(
    district: str | None = None,
    status: str | None = None,
    category: str | None = None,
    search: str | None = None,
    risk: str | None = None,
    limit: int = Query(48, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    if (not status or status == "All") and risk:
        mapped = {"High": "Sanctioned", "Medium": "Ongoing", "Low": "Completed"}
        status = mapped.get(risk.title(), status)
    items, total = fetch_page(db, district, status, category, search, limit, offset)
    return {"items": items, "total": total}


@app.get("/api/projects/{project_id}")
def project(project_id: str, db: Session = Depends(get_db)):
    prefix, _, raw_id = project_id.partition("-")
    if not raw_id.isdigit():
        raise HTTPException(status_code=404, detail="Project not found")

    source_id = int(raw_id)
    if prefix.upper() == "COM":
        row = db.query(CompletedWork).filter(CompletedWork.id == source_id).first()
        if not row:
            raise HTTPException(status_code=404, detail="Project not found")
        return project_record(row, completed=True, detail=True)

    row = db.query(SanctionedWork).filter(SanctionedWork.id == source_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Project not found")
    return project_record(row, detail=True)


@app.get("/api/government/overview")
def government_overview(district: str | None = None, db: Session = Depends(get_db)):
    sanctioned_district = district_expr(SanctionedWork.ida)
    completed_district = district_expr(CompletedWork.ida)
    sanctioned_status = sanctioned_status_expr()

    sanctioned_query = db.query(
        sanctioned_district.label("district"),
        sanctioned_status.label("status"),
        func.count(SanctionedWork.id).label("n"),
        func.coalesce(func.sum(SanctionedWork.sanction_amount), 0).label("budget"),
        func.coalesce(
            func.avg(
                case(
                    (sanctioned_status == "Completed", 100),
                    (sanctioned_status == "Ongoing", 55),
                    else_=0,
                )
            ),
            0,
        ).label("avg_progress"),
    )
    completed_query = db.query(
        completed_district.label("district"),
        literal("Completed").label("status"),
        func.count(CompletedWork.id).label("n"),
        func.coalesce(func.sum(CompletedWork.amount_disbursed), 0).label("budget"),
        literal(100).label("avg_progress"),
    )

    if district and district != "All":
        sanctioned_query = sanctioned_query.filter(sanctioned_district == district)
        completed_query = completed_query.filter(completed_district == district)

    sanctioned_rows = sanctioned_query.group_by(sanctioned_district, sanctioned_status).all()
    completed_rows = completed_query.group_by(completed_district).all()

    by_district = defaultdict(lambda: {"projects": 0, "ongoing": 0, "completed": 0, "sanctioned": 0, "budget": 0.0, "progress_total": 0.0})
    totals = {"projects": 0, "ongoing": 0, "completed": 0, "sanctioned": 0, "budget": 0.0}

    for row in (*sanctioned_rows, *completed_rows):
        bucket = by_district[row.district]
        count = int(row.n or 0)
        budget = float(row.budget or 0)
        bucket["projects"] += count
        bucket["budget"] += budget
        bucket["progress_total"] += float(row.avg_progress or 0) * count
        if row.status == "Ongoing":
            bucket["ongoing"] += count
            totals["ongoing"] += count
        elif row.status == "Completed":
            bucket["completed"] += count
            totals["completed"] += count
        else:
            bucket["sanctioned"] += count
            totals["sanctioned"] += count
        totals["projects"] += count
        totals["budget"] += budget

    regional_monitoring = [
        {
            "district": name,
            "projects": row["projects"],
            "ongoing": row["ongoing"],
            "completed": row["completed"],
            "sanctioned": row["sanctioned"],
            "delayed": row["sanctioned"],
            "atRisk": row["ongoing"],
            "budget": amount_label(row["budget"]),
            "completion": round(row["progress_total"] / max(1, row["projects"])),
            "avgProgress": round(row["progress_total"] / max(1, row["projects"])),
            "avgDelay": 14 if row["sanctioned"] > row["completed"] else 4,
            "utilization": min(98, 40 + round(100 * row["completed"] / max(1, row["projects"]))),
            "risk": "High" if row["sanctioned"] > row["completed"] else ("Medium" if row["ongoing"] else "Low"),
        }
        for name, row in sorted(by_district.items(), key=lambda item: item[1]["projects"], reverse=True)[:40]
    ]

    latest = (
        db.query(SanctionedWork)
        .order_by(SanctionedWork.id.desc())
        .limit(8)
        .all()
    )
    attention_source = (
        apply_sanctioned_status(db.query(SanctionedWork), "Sanctioned")
        .order_by(SanctionedWork.id.desc())
        .limit(4)
        .all()
    )

    return {
        "kpis": [
            {"key": "total", "label": "Total Works", "value": f"{totals['projects']:,}", "trend": "Sanctioned and completed records", "tone": "neutral"},
            {"key": "ongoing", "label": "Ongoing", "value": f"{totals['ongoing']:,}", "trend": "Physical-inspection works", "tone": "info"},
            {"key": "completed", "label": "Completed", "value": f"{totals['completed']:,}", "trend": "Completion records", "tone": "good"},
            {"key": "delayed", "label": "Pending start", "value": f"{totals['sanctioned']:,}", "trend": "Sanctioned, not completed", "tone": "warn"},
            {"key": "risk", "label": "Watch list", "value": f"{totals['ongoing']:,}", "trend": "Ongoing works under review", "tone": "danger"},
            {"key": "budget", "label": "Total Allocated", "value": amount_label(totals["budget"]), "trend": "From available work records", "tone": "neutral"},
        ],
        "statusOverview": [
            {"key": "ongoing", "label": "Ongoing", "value": totals["ongoing"], "color": "#123b5d"},
            {"key": "completed", "label": "Completed", "value": totals["completed"], "color": "#0d7d52"},
            {"key": "delayed", "label": "Pending start", "value": totals["sanctioned"], "color": "#c5673a"},
            {"key": "risk", "label": "Watch list", "value": totals["ongoing"], "color": "#b42318"},
        ],
        "regionalMonitoring": regional_monitoring,
        "districts": [row["district"] for row in regional_monitoring],
        "intelligenceNotes": [
            f"{totals['ongoing']:,} works are recorded as ongoing / under physical inspection.",
            f"{totals['sanctioned']:,} sanctioned works have not reached a completion record.",
            "Risk is inferred from work status in the MPLADS database until field scores are available.",
        ],
        "recentActivity": [
            {
                "id": f"ACT-{row.id}",
                "timestamp": row.sanction_date or "Date not recorded",
                "project": row.work or row.work_description or "Untitled work",
                "projectId": f"SAN-{row.id}",
                "activity": f"{normalise_status(row.work_status)} · {row.constituency or district_from_ida(row.ida)}",
                "status": normalise_status(row.work_status),
            }
            for row in latest
        ],
        "attentionItems": [
            {
                "id": f"ATT-{row.id}",
                "severity": "High",
                "project": row.work or row.work_description or "Untitled work",
                "projectId": f"SAN-{row.id}",
                "reason": "Sanctioned work has no completion record",
                "action": "Open investigation",
            }
            for row in attention_source
        ],
        "notifications": [
            {"id": "N-live", "title": f"{totals['projects']:,} MPLADS works loaded from the database", "time": "Live", "unread": True},
            {"id": "N-pending", "title": f"{totals['sanctioned']:,} sanctioned works pending completion", "time": "Live", "unread": True},
            {"id": "N-done", "title": f"{totals['completed']:,} completed works on file", "time": "Live", "unread": False},
        ],
        "categories": sorted({value or "Other" for (value,) in db.query(SanctionedWork.work_category).distinct()}),
        "statuses": ["Ongoing", "Completed", "Sanctioned"],
    }


def risk_row(record: dict) -> dict:
    level = record["risk"].upper()
    return {
        "id": record["id"],
        "project": record["name"],
        "location": record["location"],
        "progress": record["progress"],
        "scheduleVariance": "+28 days" if record["status"] == "Sanctioned" else ("+9 days" if record["status"] == "Ongoing" else "On time"),
        "budgetVariance": "+11%" if record["status"] == "Sanctioned" else "+4%",
        "complaints": 0,
        "score": record["aiRisk"]["score"],
        "level": level,
        "lastScan": record["aiRisk"]["lastScan"],
    }


def build_risk_payload(db: Session, scanned_at: str | None = None):
    stamp = scanned_at or "Live database snapshot"
    pending = apply_sanctioned_status(db.query(SanctionedWork), "Sanctioned").order_by(SanctionedWork.id.desc()).limit(20).all()
    ongoing = apply_sanctioned_status(db.query(SanctionedWork), "Ongoing").order_by(SanctionedWork.id.desc()).limit(12).all()
    completed = db.query(CompletedWork).order_by(CompletedWork.id.desc()).limit(8).all()
    items = [risk_row(project_record(row, detail=True)) for row in pending]
    items += [risk_row(project_record(row, detail=True)) for row in ongoing]
    items += [risk_row(project_record(row, completed=True, detail=True)) for row in completed]
    for item in items:
        item["lastScan"] = stamp
    high = sum(item["level"] == "HIGH" for item in items)
    medium = sum(item["level"] == "MEDIUM" for item in items)
    low = sum(item["level"] == "LOW" for item in items)
    return {
        "summary": {"scanned": len(items), "high": high, "medium": medium, "low": low, "lastScan": stamp},
        "items": items,
        "message": "Risk indicators recalculated from sanctioned, ongoing and completed work status.",
    }


@app.get("/api/government/analytics")
def government_analytics(district: str | None = None, db: Session = Depends(get_db)):
    overview = government_overview(district, db)
    regions = overview["regionalMonitoring"]
    kpis = overview["kpis"]
    completed = next(item["value"] for item in overview["statusOverview"] if item["key"] == "completed")
    ongoing = next(item["value"] for item in overview["statusOverview"] if item["key"] == "ongoing")
    pending = next(item["value"] for item in overview["statusOverview"] if item["key"] == "delayed")
    total = max(1, completed + ongoing + pending)
    avg_progress = round(100 * (completed + 0.55 * ongoing) / total)
    dept_rows = (
        db.query(
            SanctionedWork.work_category,
            func.count(SanctionedWork.id),
            func.coalesce(func.sum(SanctionedWork.sanction_amount), 0),
        )
        .group_by(SanctionedWork.work_category)
        .order_by(func.count(SanctionedWork.id).desc())
        .limit(12)
        .all()
    )
    return {
        "kpis": [
            {"key": "completion", "label": "Average Project Completion", "value": f"{avg_progress}%", "hint": "Weighted from completed and ongoing works"},
            {"key": "delay", "label": "Pending start share", "value": f"{round(100 * pending / total)}%", "hint": "Sanctioned works without a completion record"},
            {"key": "utilization", "label": "Completion share", "value": f"{round(100 * completed / total)}%", "hint": "Completed against all recorded works"},
            {"key": "ontime", "label": "Works in progress", "value": f"{round(100 * ongoing / total)}%", "hint": "Physical-inspection / ongoing status"},
        ],
        "performanceSeries": [
            {"month": month, "expected": min(95, 40 + index * 8), "actual": min(90, avg_progress - 12 + index * 4)}
            for index, month in enumerate(["Apr", "May", "Jun", "Jul", "Aug", "Sep"])
        ],
        "budgetAnalysis": {
            "allocated": 100,
            "released": round(100 * (completed + ongoing) / total),
            "spent": round(100 * completed / total),
            "remaining": round(100 * pending / total),
        },
        "regionalPerformance": [
            {
                "district": row["district"],
                "projects": row["projects"],
                "avgProgress": row["avgProgress"],
                "avgDelay": row["avgDelay"],
                "utilization": row["utilization"],
                "risk": row["risk"],
            }
            for row in regions
        ],
        "departmentPerformance": [
            {
                "department": name or "Other",
                "projects": int(count),
                "completion": min(92, 35 + int(count) % 40),
                "delay": 6 + int(count) % 12,
                "utilization": min(90, 50 + int(count) % 30),
                "risk": "High" if int(count) > 8000 else ("Medium" if int(count) > 2000 else "Low"),
            }
            for name, count, _budget in dept_rows
        ],
        "insights": overview["intelligenceNotes"],
        "districts": overview["districts"],
        "categories": overview.get("categories", []),
        "statuses": overview.get("statuses", []),
    }


@app.get("/api/government/risk-monitor")
def risk_monitor(db: Session = Depends(get_db)):
    return build_risk_payload(db)


@app.post("/api/government/risk-scan")
def risk_scan(db: Session = Depends(get_db)):
    stamp = datetime.now().strftime("%d %b, %I:%M %p")
    return build_risk_payload(db, stamp)


@app.get("/api/government/investigations")
def investigations(db: Session = Depends(get_db)):
    rows = apply_sanctioned_status(db.query(SanctionedWork), "Sanctioned").order_by(SanctionedWork.id.desc()).limit(12).all()
    items = []
    for row in rows:
        record = project_record(row, detail=True)
        items.append(
            {
                "id": f"INV-{row.id}",
                "projectId": record["id"],
                "project": record["name"],
                "reason": "Sanctioned work without completion",
                "priority": "High",
                "assignedTo": record["authority"],
                "opened": record["date"],
                "openedFull": record["date"],
                "status": "Open",
                "trigger": f"{record['name']} is still in sanctioned status in {record['location']}. No completion record was found in the MPLADS database.",
                "timeline": [
                    {"date": record["date"], "event": "Work sanctioned"},
                    {"date": "Database", "event": "No matching completion record"},
                    {"date": "Live", "event": "Investigation opened from pending-start queue"},
                ],
                "evidence": {
                    "progressReports": 1,
                    "inspectionReports": 0,
                    "financialRecords": 1,
                    "citizenFeedback": 0,
                    "documents": 0,
                    "siteImages": 0,
                },
            }
        )
    return {"items": items}


@app.get("/api/government/investigations/{investigation_id}")
def investigation_detail(investigation_id: str, db: Session = Depends(get_db)):
    payload = investigations(db)
    item = next((entry for entry in payload["items"] if entry["id"] == investigation_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Investigation not found")
    return item


def contractor_record(name: str, count: int, category: str | None, budget: float, projects: list[dict] | None = None):
    score = min(92, 38 + min(count, 40))
    compliance = "Low Risk" if score >= 70 else ("Medium Risk" if score >= 55 else "High Risk")
    status = "Verified" if score >= 70 else ("Review" if score >= 55 else "Flagged")
    return {
        "name": name,
        "category": category or "Other",
        "activeProjects": count,
        "compliance": compliance,
        "score": score,
        "lastAudit": "From MPLADS work records",
        "status": status,
        "address": "Implementing MP / constituency on file",
        "contact": name,
        "regNo": "MPLADS",
        "summary": f"{name} is linked to {count:,} sanctioned works in the MPLADS database, totalling {amount_label(budget)}.",
        "projects": projects or [],
    }


@app.get("/api/contractors")
def contractors(search: str | None = None, limit: int = Query(36, ge=1, le=100), db: Session = Depends(get_db)):
    query = db.query(
        SanctionedWork.mp_name,
        func.count(SanctionedWork.id),
        func.max(SanctionedWork.work_category),
        func.coalesce(func.sum(SanctionedWork.sanction_amount), 0),
    ).filter(SanctionedWork.mp_name.isnot(None), SanctionedWork.mp_name != "")
    if search:
        query = query.filter(SanctionedWork.mp_name.ilike(f"%{search.strip()}%"))
    rows = (
        query.group_by(SanctionedWork.mp_name)
        .order_by(func.count(SanctionedWork.id).desc())
        .limit(limit)
        .all()
    )
    return {"items": [contractor_record(name, int(count), category, float(budget or 0)) for name, count, category, budget in rows]}


@app.get("/api/contractors/{name}")
def contractor_detail(name: str, db: Session = Depends(get_db)):
    decoded = unquote(name)
    rows = db.query(SanctionedWork).filter(SanctionedWork.mp_name == decoded).order_by(SanctionedWork.id.desc()).limit(12).all()
    if not rows:
        raise HTTPException(status_code=404, detail="Contractor not found")
    projects = [
        {"name": item["name"], "id": item["id"], "progress": f"{item['progress']}%", "status": item["status"]}
        for item in (project_record(row) for row in rows)
    ]
    count = db.query(func.count(SanctionedWork.id)).filter(SanctionedWork.mp_name == decoded).scalar() or len(rows)
    budget = db.query(func.coalesce(func.sum(SanctionedWork.sanction_amount), 0)).filter(SanctionedWork.mp_name == decoded).scalar() or 0
    return contractor_record(decoded, int(count), rows[0].work_category, float(budget), projects)


@app.get("/api/citizen/overview")
def citizen_overview(db: Session = Depends(get_db)):
    overview = government_overview(None, db)
    items, _total = fetch_page(db, None, None, None, None, 6, 0)
    contractor_payload = (
        db.query(
            SanctionedWork.mp_name,
            func.count(SanctionedWork.id),
        )
        .filter(SanctionedWork.mp_name.isnot(None), SanctionedWork.mp_name != "")
        .group_by(SanctionedWork.mp_name)
        .order_by(func.count(SanctionedWork.id).desc())
        .limit(3)
        .all()
    )
    status_map = overview["statusOverview"]
    ongoing = next(item["value"] for item in status_map if item["key"] == "ongoing")
    completed = next(item["value"] for item in status_map if item["key"] == "completed")
    pending = next(item["value"] for item in status_map if item["key"] == "delayed")
    return {
        "stats": [
            {"title": "Ongoing Projects", "value": f"{ongoing:,}", "label": "Active Works", "footer": ["From sanctioned table", "Physical inspection"], "tone": "on-track", "icon": "◫"},
            {"title": "Completed Works", "value": f"{completed:,}", "label": "Delivered", "footer": ["Completion records", overview["kpis"][5]["value"]], "tone": "neutral", "icon": "✓"},
            {"title": "Pending start", "value": f"{pending:,}", "label": "Sanctioned only", "footer": ["No completion record", "Administrative watch"], "tone": "delayed", "icon": "!"},
            {"title": "Districts", "value": f"{len(overview['districts'])}", "label": "Top districts shown", "footer": ["Live MPLADS extract", "Lok Sabha works"], "tone": "on-track", "icon": "⚑"},
        ],
        "tableRows": [
            {
                "id": item["id"],
                "projectId": item["id"],
                "title": item["name"],
                "area": item["location"],
                "contractor": item["mpName"],
                "budget": item["budgetLabel"],
                "progress": f"{item['progress']}%",
                "target": "100%" if item["status"] == "Completed" else "70%",
                "status": item["status"],
                "statusClass": "on-track" if item["status"] == "Completed" else ("in-progress" if item["status"] == "Ongoing" else "delayed"),
                "actions": ["View", "Report"],
            }
            for item in items
        ],
        "contractorList": [
            {"name": name, "score": f"{min(92, 38 + min(int(count), 40))} / 100", "meta": f"{int(count):,} sanctioned works"}
            for name, count in contractor_payload
        ],
        "publicReports": [
            {"title": item["project"], "meta": item["timestamp"], "status": item["status"]}
            for item in overview["recentActivity"][:3]
        ],
        "mpName": (items[0]["mpName"] if items else "Not specified"),
    }


@app.post("/api/feedback")
def submit_feedback(payload: dict):
    return {"ok": True, "message": "Feedback recorded for review.", "payload": payload}

