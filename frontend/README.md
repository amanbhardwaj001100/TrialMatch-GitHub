# Clinical Trial Matching Agent

Professional React frontend for the Clinical Trial Matching Agent.

## Stack

- React
- JavaScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

## Current Mode

The frontend currently uses mock data.

No backend API is connected yet.

## Main Routes

/login
/register
/dashboard
/patients
/patients/add
/patients/:id
/reports
/reports/upload
/analysis
/trials
/trials/:id
/matches/:patientId

## Backend Integration

Axios is already configured in:

src/services/api.js

Future flow:

React
↓
Axios
↓
FastAPI
↓
SQLite / AI
↓
JSON
↓
React UI
