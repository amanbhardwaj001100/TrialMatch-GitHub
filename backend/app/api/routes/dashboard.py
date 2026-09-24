from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.clinical_trial import ClinicalTrial
from app.models.match_result import MatchResult
from app.models.medical_report import MedicalReport
from app.models.patient import Patient
from app.models.user import User


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"],
)


@router.get("/stats")
def dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patients = db.query(Patient).count()
    reports = db.query(MedicalReport).count()
    trials = db.query(ClinicalTrial).count()
    matches = db.query(MatchResult).count()

    return {
        "patients": patients,
        "medical_reports": reports,
        "clinical_trials": trials,
        "trial_matches": matches,
    }
