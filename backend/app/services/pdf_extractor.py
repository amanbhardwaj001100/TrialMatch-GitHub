from pathlib import Path

from PyPDF2 import PdfReader


def extract_pdf_text(file_path: str) -> str:

    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(
            "Medical report file was not found."
        )

    reader = PdfReader(str(path))

    pages = []

    for page in reader.pages:

        text = page.extract_text() or ""

        if text.strip():
            pages.append(text.strip())

    return "\n\n".join(pages).strip()
