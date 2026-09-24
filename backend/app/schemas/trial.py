from pydantic import BaseModel, ConfigDict


class TrialResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nct_id: str
    name: str
    condition: str
    phase: str | None
    status: str
    location: str | None
    min_age: int | None
    max_age: int | None
    eligible_gender: str
    eligibility_text: str | None
    description: str | None
