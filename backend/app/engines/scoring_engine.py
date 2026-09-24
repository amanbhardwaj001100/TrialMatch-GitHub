from typing import Any

from app.engines.eligibility_engine import check_eligibility


WEIGHTS = {
    "age": 25,
    "disease": 35,
    "gender": 10,
    "location": 15,
    "status": 15,
}


def calculate_score(patient: Any, trial: Any) -> dict:
    eligibility_result = check_eligibility(patient, trial)

    criteria = eligibility_result["criteria"]

    score = 0

    for criterion, weight in WEIGHTS.items():
        if criteria[criterion]["eligible"]:
            score += weight

    score = min(score, 100)

    if score >= 85:
        recommendation = "Strong Match"
    elif score >= 70:
        recommendation = "Good Match"
    elif score >= 50:
        recommendation = "Possible Match"
    else:
        recommendation = "Low Match"

    return {
        "score": score,
        "eligible": eligibility_result["eligible"],
        "recommendation": recommendation,
        "criteria": criteria,
    }
