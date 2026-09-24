from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class ClinicalTrial(Base):
    __tablename__ = "clinical_trials"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    nct_id: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        index=True,
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(300),
        nullable=False,
    )

    condition: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    phase: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(100),
        default="Recruiting",
    )

    location: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    min_age: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    max_age: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    eligible_gender: Mapped[str] = mapped_column(
        String(30),
        default="All",
    )

    eligibility_text: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )
