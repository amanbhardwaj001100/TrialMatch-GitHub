import re
from typing import Any


DISEASE_PATTERNS = {
    "Type 2 Diabetes": [
        "type 2 diabetes",
        "type ii diabetes",
        "diabetes mellitus",
        "t2dm",
        "diabetic",
        "hba1c",
        "high blood sugar",
        "hyperglycemia",
    ],
    "Hypertension": [
        "hypertension",
        "high blood pressure",
        "bp elevated",
        "blood pressure",
    ],
    "Cardiovascular Disease": [
        "cardiovascular disease",
        "coronary artery disease",
        "heart disease",
        "ischemic heart disease",
        "cad",
    ],
}


MEDICATION_PATTERNS = [
    "metformin",
    "insulin",
    "glimepiride",
    "sitagliptin",
    "empagliflozin",
    "dapagliflozin",
    "losartan",
    "amlodipine",
    "telmisartan",
    "atorvastatin",
    "rosuvastatin",
]


SYMPTOM_PATTERNS = [
    "fatigue",
    "thirst",
    "frequent urination",
    "frequent urination",
    "blurred vision",
    "headache",
    "dizziness",
    "chest pain",
    "shortness of breath",
    "weakness",
]


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower()).strip()


def detect_diseases(text: str) -> list[str]:
    normalized = normalize_text(text)

    found = []

    for disease, patterns in DISEASE_PATTERNS.items():
        if any(pattern in normalized for pattern in patterns):
            found.append(disease)

    return found


def detect_medications(text: str) -> list[str]:
    normalized = normalize_text(text)

    found = []

    for medication in MEDICATION_PATTERNS:
        if medication in normalized:
            found.append(medication.title())

    return found


def detect_symptoms(text: str) -> list[str]:
    normalized = normalize_text(text)

    found = []

    for symptom in SYMPTOM_PATTERNS:
        if symptom in normalized:
            found.append(symptom.title())

    return found


def extract_numeric_findings(text: str) -> list[str]:
    findings = []

    patterns = [
        r"hba1c.{0,30}?\d+(?:\.\d+)?\s*%",
        r"blood pressure.{0,30}?\d+\s*/\s*\d+",
        r"glucose.{0,30}?\d+(?:\.\d+)?\s*(?:mg/dl|mmol/l)?",
        r"cholesterol.{0,30}?\d+(?:\.\d+)?\s*(?:mg/dl)?",
    ]

    for pattern in patterns:
        matches = re.findall(pattern, text, flags=re.IGNORECASE)

        for match in matches:
            cleaned = " ".join(match.split())
            findings.append(cleaned)

    return list(dict.fromkeys(findings))


def analyze_medical_text(text: str) -> dict[str, Any]:
    diseases = detect_diseases(text)
    medications = detect_medications(text)
    symptoms = detect_symptoms(text)
    numeric_findings = extract_numeric_findings(text)

    if diseases:
        primary_condition = diseases[0]
    else:
        primary_condition = "Unspecified"

    important_findings = []

    if numeric_findings:
        important_findings.extend(numeric_findings)

    if diseases:
        important_findings.append(
            "Possible condition identified: " + ", ".join(diseases)
        )

    if medications:
        important_findings.append(
            "Medication references detected: " + ", ".join(medications)
        )

    confidence = 0.70

    if diseases:
        confidence += 0.10

    if medications:
        confidence += 0.05

    if numeric_findings:
        confidence += 0.05

    confidence = min(confidence, 0.95)

    return {
        "condition": primary_condition,
        "conditions": diseases,
        "symptoms": symptoms,
        "medications": medications,
        "important_findings": important_findings,
        "confidence": round(confidence, 2),
        "analysis_type": "AI-assisted rule-based demo analysis",
        "disclaimer": (
            "This analysis is for research/demo purposes only and "
            "does not constitute a medical diagnosis."
        ),
    }
