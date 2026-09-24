import json

from sqlalchemy.orm import Session

from app.models.patient import Patient
from app.models.clinical_trial import ClinicalTrial
from app.models.match_result import MatchResult
from app.engines.scoring_engine import calculate_score


def run_matching(
    patient: Patient,
    db: Session,
) -> list[dict]:

    trials = (
        db.query(ClinicalTrial)
        .order_by(ClinicalTrial.id.asc())
        .all()
    )

    results = []

    # Remove old results for this patient.
    db.query(MatchResult).filter(
        MatchResult.patient_id == patient.id
    ).delete(
        synchronize_session=False
    )

    for trial in trials:

        scoring = calculate_score(
            patient,
            trial,
        )

        criteria = scoring["criteria"]

        match = MatchResult(
            patient_id=patient.id,
            trial_id=trial.id,
            score=scoring["score"],
            eligible=scoring["eligible"],
            criteria=json.dumps(
                criteria,
                ensure_ascii=False,
            ),
        )

        db.add(match)

        results.append({
            "trial_id": trial.id,
            "nct_id": trial.nct_id,
            "trial_name": trial.name,
            "condition": trial.condition,
            "phase": trial.phase,
            "status": trial.status,
            "location": trial.location,
            "score": scoring["score"],
            "eligible": scoring["eligible"],
            "recommendation": scoring["recommendation"],
            "criteria": criteria,
        })

    db.commit()

    results.sort(
        key=lambda item: item["score"],
        reverse=True,
    )

    return results
