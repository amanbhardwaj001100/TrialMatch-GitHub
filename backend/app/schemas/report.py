from datetime import datetime

from pydantic import BaseModel, ConfigDict


class MedicalReportBase(BaseModel):
    patient_id: int
    report_type: str = "Medical Report"


class MedicalReportResponse(MedicalReportBase):
    id: int
    filename: str
    file_path: str
    extracted_text: str | None = None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
