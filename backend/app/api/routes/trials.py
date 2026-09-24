from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.clinical_trial import ClinicalTrial
from app.models.user import User
from app.schemas.trial import TrialResponse


router = APIRouter(
    prefix="/api/trials",
    tags=["Clinical Trials"],
)


@router.get(
    "",
    response_model=list[TrialResponse],
)
def list_trials(
    search: str | None = Query(default=None),
    condition: str | None = Query(default=None),
    phase: str | None = Query(default=None),
    status: str | None = Query(default=None),
    location: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(ClinicalTrial)

    if search:
        pattern = f"%{search.strip()}%"

        query = query.filter(
            (ClinicalTrial.name.ilike(pattern))
            | (ClinicalTrial.nct_id.ilike(pattern))
            | (ClinicalTrial.condition.ilike(pattern))
        )

    if condition:
        query = query.filter(
            ClinicalTrial.condition.ilike(
                f"%{condition.strip()}%"
            )
        )

    if phase:
        query = query.filter(
            ClinicalTrial.phase.ilike(
                f"%{phase.strip()}%"
            )
        )

    if status:
        query = query.filter(
            ClinicalTrial.status.ilike(
                f"%{status.strip()}%"
            )
        )

    if location:
        query = query.filter(
            ClinicalTrial.location.ilike(
                f"%{location.strip()}%"
            )
        )

    return query.order_by(
        ClinicalTrial.id.desc()
    ).all()


@router.get(
    "/{trial_id}",
    response_model=TrialResponse,
)
def get_trial(
    trial_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trial = db.query(ClinicalTrial).filter(
        ClinicalTrial.id == trial_id
    ).first()

    if not trial:
        raise HTTPException(
            status_code=404,
            detail="Clinical trial not found",
        )

    return trial
