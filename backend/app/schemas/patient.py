from pydantic import BaseModel, ConfigDict, Field


class PatientCreate(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    age: int = Field(ge=0, le=120)
    gender: str
    disease: str
    disease_stage: str | None = None
    city: str | None = None
    contact: str | None = None
    symptoms: str | None = None
    medications: str | None = None


class PatientResponse(PatientCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
