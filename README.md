# To-Do List App (Full Stack)

A modern and aesthetic full-stack To-Do List mobile app built with:
- **Frontend**: React Native (Expo)
- **Backend**: FastAPI (Python)
- **Database**: SQLite

---

## Folder Structure
mytodo-fullstack-app/ ├── backend/ # FastAPI server └── frontend/ # React Native app

---

## Backend (FastAPI)

### Setup
1. Navigate to the `backend` folder:
   ```bash
   cd todo-backend

2. Create virtual environment & install dependencies:
    python -m venv venv
    venv\Scripts\activate  # Windows
    pip install -r requirements.txt

3. Run the API server:
    uvicorn main:app --reload --host 0.0.0.0 --port 8000

Endpoints
Swagger UI: http://localhost:8000/docs

Frontend (React Native)
Setup
1. Navigate to the frontend folder:
    cd todo-mobile

2. Install dependencies:
    npm install

3. Run the app (via Expo):
    npx expo start