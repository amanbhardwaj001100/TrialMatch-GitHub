from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.api.routes import (
    auth,
    patients,
    trials,
    dashboard,
    reports,
    analysis,
    matching,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        from app.services.seed import seed_trials
        seed_trials(db)
    finally:
        db.close()

    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "AI-assisted Clinical Trial Matching Platform. "
        "Medical report extraction, analysis and "
        "clinical trial matching."
    ),
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(trials.router)
app.include_router(dashboard.router)
app.include_router(reports.router)
app.include_router(analysis.router)
app.include_router(matching.router)


@app.get("/")
def root():
    return {
        "message": "TrialMatch Backend is running",
        "version": settings.app_version,
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "trialmatch-backend",
    }
