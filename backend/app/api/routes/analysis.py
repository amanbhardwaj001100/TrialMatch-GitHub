from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.medical_report import MedicalReport
from app.models.patient import Patient
from app.services.medical_ai import analyze_medical_text


router = APIRouter(prefix="/api/analysis", tags=["Medical Analysis"])


@router.post("/{report_id}")
def analyze_report(
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

    patient = (
        db.query(Patient)
        .filter(Patient.id == report.patient_id)
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found.",
        )

    if not report.extracted_text:
        raise HTTPException(
            status_code=400,
            detail="No extractable text found in this medical report.",
        )

    result = analyze_medical_text(report.extracted_text)

    # Keep useful patient information synchronized.
    if result["condition"] != "Unspecified":
        patient.disease = result["condition"]

    if result["symptoms"]:
        patient.symptoms = ", ".join(result["symptoms"])

    if result["medications"]:
        patient.medications = ", ".join(result["medications"])

    report.status = "Analyzed"

    db.commit()

    return {
        "report_id": report.id,
        "patient_id": patient.id,
        "patient_name": patient.name,
        "filename": report.filename,
        **result,
    }
