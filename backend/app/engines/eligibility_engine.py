from typing import Any


def normalize(value: str | None) -> str:
    if not value:
        return ""
    return value.strip().lower()


def gender_matches(
    patient_gender: str | None,
    eligible_gender: str | None,
) -> bool:
    patient = normalize(patient_gender)
    eligible = normalize(eligible_gender)

    if not eligible or eligible in {"all", "any", "both"}:
        return True

    if not patient:
        return False

    return patient == eligible


def disease_matches(
    patient_disease: str | None,
    trial_condition: str | None,
) -> bool:
    patient = normalize(patient_disease)
    condition = normalize(trial_condition)

    if not patient or not condition:
        return False

    patient_words = set(patient.replace("-", " ").split())
    condition_words = set(condition.replace("-", " ").split())

    if patient in condition or condition in patient:
        return True

    if patient_words.intersection(condition_words):
        return True

    disease_aliases = {
        "type 2 diabetes": ["diabetes", "diabetes mellitus", "t2dm"],
        "diabetes": ["type 2 diabetes", "diabetes mellitus", "t2dm"],
        "hypertension": ["high blood pressure"],
        "cardiovascular disease": [
            "heart disease",
            "cardiovascular",
        ],
    }

    for key, aliases in disease_aliases.items():
        if patient == key and any(alias in condition for alias in aliases):
            return True

    return False


def location_matches(
    patient_city: str | None,
    trial_location: str | None,
) -> bool:
    patient = normalize(patient_city)
    location = normalize(trial_location)

    if not patient or not location:
        return False

    return (
        patient in location
        or location in patient
    )


def check_eligibility(patient: Any, trial: Any) -> dict:
    criteria = {}

    age = patient.age

    if age is None:
        age_eligible = False
    else:
        min_age = trial.min_age if trial.min_age is not None else 0
        max_age = trial.max_age if trial.max_age is not None else 150
        age_eligible = min_age <= age <= max_age

    criteria["age"] = {
        "eligible": age_eligible,
        "patient_value": age,
        "required": (
            f"{trial.min_age or 0}-{trial.max_age or 150}"
        ),
    }

    disease_eligible = disease_matches(
        patient.disease,
        trial.condition,
    )

    criteria["disease"] = {
        "eligible": disease_eligible,
        "patient_value": patient.disease,
        "trial_value": trial.condition,
    }

    gender_eligible = gender_matches(
        patient.gender,
        trial.eligible_gender,
    )

    criteria["gender"] = {
        "eligible": gender_eligible,
        "patient_value": patient.gender,
        "trial_value": trial.eligible_gender,
    }

    location_eligible = location_matches(
        patient.city,
        trial.location,
    )

    criteria["location"] = {
        "eligible": location_eligible,
        "patient_value": patient.city,
        "trial_value": trial.location,
    }

    status = normalize(trial.status)

    status_eligible = status in {
        "recruiting",
        "not yet recruiting",
    }

    criteria["status"] = {
        "eligible": status_eligible,
        "trial_value": trial.status,
    }

    all_required = all(
        item["eligible"]
        for item in criteria.values()
    )

    return {
        "eligible": all_required,
        "criteria": criteria,
    }
