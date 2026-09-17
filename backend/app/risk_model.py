"""Runtime MPLADS anomaly prediction service based on the supplied notebook."""

from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parents[2]
DATASET = ROOT / "data" / "mplads_data.csv"
MODEL_FILE = ROOT / "backend" / "saved_models" / "mplads_risk_bundle.joblib"
INPUTS = ["category", "mp_name", "state", "district", "agency_name", "sanction_date", "expected_completion", "estimated_cost", "sanctioned_amount", "released_amount", "expenditure", "progress_percentage", "latitude", "longitude", "status"]
TARGETS = [("is_cost_anomaly", "Cost anomaly"), ("is_exp_anomaly", "Expenditure anomaly"), ("is_progress_anomaly", "Progress anomaly"), ("is_delay", "Delay risk"), ("is_duplicate", "Duplicate-work risk")]
IGNORED_TARGETS = {"is_duplicate"}
_bundle = None


def _prepare(frame):
    data = frame.copy()
    data["sanction_date"] = pd.to_datetime(data["sanction_date"], errors="coerce")
    data["expected_completion"] = pd.to_datetime(data["expected_completion"], errors="coerce")
    data["sanction_year"] = data["sanction_date"].dt.year
    data["sanction_month"] = data["sanction_date"].dt.month
    data["sanction_day"] = data["sanction_date"].dt.day
    data["sanction_dayofweek"] = data["sanction_date"].dt.dayofweek
    data["expected_duration_days"] = (data["expected_completion"] - data["sanction_date"]).dt.days
    data["fund_utilization_ratio"] = np.where(data["released_amount"] != 0, data["expenditure"] / data["released_amount"], 0)
    data["release_ratio"] = np.where(data["sanctioned_amount"] != 0, data["released_amount"] / data["sanctioned_amount"], 0)
    data["expenditure_ratio"] = np.where(data["sanctioned_amount"] != 0, data["expenditure"] / data["sanctioned_amount"], 0)
    data["cost_difference"] = data["sanctioned_amount"] - data["estimated_cost"]
    data = data.drop(columns=["sanction_date", "expected_completion"], errors="ignore")
    return pd.get_dummies(data, columns=["category", "mp_name", "state", "district", "agency_name", "status"], dtype=int)


def _get_bundle():
    global _bundle
    if _bundle is not None:
        return _bundle
    if MODEL_FILE.exists():
        _bundle = joblib.load(MODEL_FILE)
        return _bundle
    raw = pd.read_csv(DATASET)
    features = _prepare(raw[INPUTS]).fillna(0)
    models = {}
    for target, _ in TARGETS:
        scaler = StandardScaler()
        model = LogisticRegression(max_iter=1000, class_weight="balanced")
        model.fit(scaler.fit_transform(features), raw[target].astype(int))
        models[target] = {"model": model, "scaler": scaler, "features": list(features.columns)}
    _bundle = {"models": models}
    MODEL_FILE.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(_bundle, MODEL_FILE)
    return _bundle


def assess(payload):
    missing = [key for key in INPUTS if payload.get(key) in (None, "")]
    if missing:
        raise ValueError(f"Missing required fields: {', '.join(missing)}")
    values = {key: payload[key] for key in INPUTS}
    for key in ("estimated_cost", "sanctioned_amount", "released_amount", "expenditure", "progress_percentage", "latitude", "longitude"):
        values[key] = float(values[key])
    prepared = _prepare(pd.DataFrame([values])).fillna(0)
    results = []
    for target, label in TARGETS:
        if target in IGNORED_TARGETS:
            continue
        item = _get_bundle()["models"][target]
        X = prepared.reindex(columns=item["features"], fill_value=0)
        probability = float(item["model"].predict_proba(item["scaler"].transform(X))[0][1])
        results.append({"key": target, "label": label, "detected": probability >= 0.5, "probability": round(probability * 100, 1)})
    net_risk = round(max(item["probability"] for item in results), 1)
    return {"results": results, "netRisk": net_risk, "level": "High" if net_risk >= 75 else "Medium" if net_risk >= 45 else "Low"}
