import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.patient import Patient
from app.models.match_result import MatchResult
from app.models.clinical_trial import ClinicalTrial
from app.services.matching_service import run_matching


router = APIRouter(
    prefix="/api/matches",
    tags=["Clinical Trial Matching"],
)


def build_match_response(
    match: MatchResult,
    trial: ClinicalTrial,
) -> dict:

    score = match.score

    if score >= 85:
        recommendation = "Strong Match"
    elif score >= 70:
        recommendation = "Good Match"
    elif score >= 50:
        recommendation = "Possible Match"
    else:
        recommendation = "Low Match"

    criteria = match.criteria

    if isinstance(criteria, str):
        try:
            criteria = json.loads(criteria)
        except json.JSONDecodeError:
            criteria = {}

    if criteria is None:
        criteria = {}

    return {
        "match_id": match.id,
        "patient_id": match.patient_id,
        "trial_id": trial.id,
        "nct_id": trial.nct_id,
        "trial_name": trial.name,
        "condition": trial.condition,
        "phase": trial.phase,
        "status": trial.status,
        "location": trial.location,
        "score": score,
        "eligible": match.eligible,
        "recommendation": recommendation,
        "criteria": criteria,
    }


@router.post("/{patient_id}/run")
def run_trial_matching(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    patient = (
        db.query(Patient)
        .filter(Patient.id == patient_id)
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found.",
        )

    matches = run_matching(
        patient,
        db,
    )

    return {
        "patient_id": patient.id,
        "patient_name": patient.name,
        "total_trials_evaluated": len(matches),
        "matches": matches,
        "disclaimer": (
            "This is a research/demo matching system. "
            "Final clinical trial eligibility must be confirmed "
            "by the study team."
        ),
    }


@router.get("/{patient_id}")
def get_trial_matches(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    patient = (
        db.query(Patient)
        .filter(Patient.id == patient_id)
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found.",
        )

    rows = (
        db.query(MatchResult, ClinicalTrial)
        .join(
            ClinicalTrial,
            ClinicalTrial.id == MatchResult.trial_id,
        )
        .filter(
            MatchResult.patient_id == patient_id
        )
        .order_by(
            MatchResult.score.desc()
        )
        .all()
    )

    # If matching has not been executed yet,
    # generate fresh results automatically.
    if not rows:
        matches = run_matching(
            patient,
            db,
        )

        return {
            "patient_id": patient.id,
            "patient_name": patient.name,
            "total_matches": len(matches),
            "matches": matches,
        }

    matches = [
        build_match_response(
            match,
            trial,
        )
        for match, trial in rows
    ]

    return {
        "patient_id": patient.id,
        "patient_name": patient.name,
        "total_matches": len(matches),
        "matches": matches,
    }
