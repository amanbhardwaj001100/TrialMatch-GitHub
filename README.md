# TrialMatch

AI-assisted Clinical Trial Matching Platform.

## Project Structure

- `frontend/` - React + Vite frontend
- `backend/` - FastAPI + SQLAlchemy backend

## Run Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --port 8000
```

## Run Frontend

Open a second terminal:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Open the Vite URL shown in the terminal.

## Notes

- Do not commit `.env` files.
- Do not commit local database files.
- The backend will create/seed the SQLite database on startup.
