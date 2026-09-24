from sqlalchemy.orm import Session

from app.models.clinical_trial import ClinicalTrial


DEMO_TRIALS = [
    {
        "nct_id": "NCT-DEMO-001",
        "name": "Type 2 Diabetes Lifestyle and Treatment Study",
        "condition": "Type 2 Diabetes",
        "phase": "Phase 3",
        "status": "Recruiting",
        "location": "Delhi",
        "min_age": 18,
        "max_age": 75,
        "eligible_gender": "All",
        "eligibility_text": (
            "Adults aged 18-75 with Type 2 Diabetes. "
            "Participants should be medically suitable "
            "for the study protocol."
        ),
        "description": (
            "A clinical research study evaluating "
            "treatment and lifestyle interventions "
            "for adults with Type 2 Diabetes."
        ),
    },
    {
        "nct_id": "NCT-DEMO-002",
        "name": "Diabetes Metabolic Health Research Trial",
        "condition": "Type 2 Diabetes",
        "phase": "Phase 2",
        "status": "Recruiting",
        "location": "Gurugram",
        "min_age": 21,
        "max_age": 70,
        "eligible_gender": "All",
        "eligibility_text": (
            "Adults 21-70 years old with Type 2 Diabetes."
        ),
        "description": (
            "Research study focused on metabolic health "
            "and diabetes management."
        ),
    },
    {
        "nct_id": "NCT-DEMO-003",
        "name": "Cardiometabolic Risk Prevention Study",
        "condition": "Diabetes",
        "phase": "Phase 3",
        "status": "Recruiting",
        "location": "Noida",
        "min_age": 30,
        "max_age": 70,
        "eligible_gender": "All",
        "eligibility_text": (
            "Adults with diabetes and cardiometabolic "
            "risk factors."
        ),
        "description": (
            "Study evaluating strategies to reduce "
            "cardiometabolic risk."
        ),
    },
    {
        "nct_id": "NCT-DEMO-004",
        "name": "Hypertension Treatment Research Study",
        "condition": "Hypertension",
        "phase": "Phase 2",
        "status": "Recruiting",
        "location": "Delhi",
        "min_age": 18,
        "max_age": 80,
        "eligible_gender": "All",
        "eligibility_text": (
            "Adults with diagnosed hypertension."
        ),
        "description": (
            "Research evaluating treatment approaches "
            "for hypertension."
        ),
    },
    {
        "nct_id": "NCT-DEMO-005",
        "name": "Diabetes Technology Monitoring Trial",
        "condition": "Type 2 Diabetes",
        "phase": "Phase 2",
        "status": "Not Yet Recruiting",
        "location": "Mumbai",
        "min_age": 18,
        "max_age": 65,
        "eligible_gender": "All",
        "eligibility_text": (
            "Adults 18-65 with Type 2 Diabetes."
        ),
        "description": (
            "Study investigating technology-assisted "
            "monitoring of diabetes."
        ),
    },
]


def seed_trials(db: Session):
    existing = db.query(ClinicalTrial).count()

    if existing > 0:
        return

    for trial_data in DEMO_TRIALS:
        trial = ClinicalTrial(
            **trial_data
        )

        db.add(trial)

    db.commit()
