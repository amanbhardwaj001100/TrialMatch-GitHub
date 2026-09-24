from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.medical_report import MedicalReport
from app.models.patient import Patient
from app.schemas.report import MedicalReportResponse
from app.services.pdf_extractor import extract_pdf_text


router = APIRouter(
    prefix="/api/reports",
    tags=["Medical Reports"],
)


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post(
    "/upload",
    response_model=MedicalReportResponse,
)
async def upload_medical_report(
    patient_id: int,
    report_type: str = "Medical Report",
    file: UploadFile = File(...),
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

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="File name is required.",
        )

    extension = Path(file.filename).suffix.lower()

    allowed_extensions = {
        ".pdf",
        ".txt",
    }

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and TXT medical reports are supported.",
        )

    safe_name = (
        f"{uuid4().hex}"
        f"{extension}"
    )

    file_path = UPLOAD_DIR / safe_name

    content = await file.read()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )

    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File size must be below 10 MB.",
        )

    file_path.write_bytes(content)

    try:

        if extension == ".pdf":
            extracted_text = extract_pdf_text(
                str(file_path)
            )

        else:
            extracted_text = content.decode(
                "utf-8",
                errors="ignore",
            )

    except Exception as exc:

        file_path.unlink(
            missing_ok=True
        )

        raise HTTPException(
            status_code=422,
            detail=f"Unable to extract report text: {exc}",
        )

    if not extracted_text.strip():
        extracted_text = (
            "No readable text was extracted "
            "from this medical report."
        )

    report = MedicalReport(
        patient_id=patient_id,
        filename=file.filename,
        file_path=str(file_path),
        report_type=report_type,
        extracted_text=extracted_text,
        status="Processed",
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return report


@router.get(
    "",
    response_model=list[MedicalReportResponse],
)
def get_reports(
    patient_id: int | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    query = db.query(MedicalReport)

    if patient_id is not None:
        query = query.filter(
            MedicalReport.patient_id == patient_id
        )

    return (
        query
        .order_by(
            MedicalReport.created_at.desc()
        )
        .all()
    )


@router.get(
    "/{report_id}",
    response_model=MedicalReportResponse,
)
def get_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    report = (
        db.query(MedicalReport)
        .filter(MedicalReport.id == report_id)
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Medical report not found.",
        )

    return report
