# Student Management System

A production-quality full-stack web application for managing student records.

**Stack:** React (Vite + TypeScript) → FastAPI → SQLAlchemy → PostgreSQL

## Features

- **Dashboard** – Total students, gender breakdown, recently added students, quick-add action
- **Student List** – Searchable, filterable, sortable, paginated professional table
- **CRUD** – Create, view, edit, and delete students with full validation
- **Responsive** – Works on desktop and mobile
- **Modern UI** – Dark theme admin dashboard

## Project Structure

```
student-management-system/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entrypoint
│   │   ├── database.py      # SQLAlchemy engine & session
│   │   ├── models.py        # Student ORM model
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── crud.py          # Database operations
│   │   └── routers/
│   │       ├── students.py  # /api/students endpoints
│   │       └── stats.py     # /api/stats/dashboard
│   ├── requirements.txt
│   └── .env
└── frontend/
    ├── src/
    │   ├── api.ts
    │   ├── types.ts
    │   ├── components/
    │   ├── pages/
    │   ├── App.tsx
    │   └── index.css
    ├── package.json
    └── vite.config.ts
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

## Database Setup

```bash
# Create user and database (example)
sudo -u postgres psql
CREATE USER sms_user WITH PASSWORD 'sms_password';
CREATE DATABASE student_management OWNER sms_user;
GRANT ALL PRIVILEGES ON DATABASE student_management TO sms_user;
\q
```

Update `backend/.env` if your credentials differ:

```
DATABASE_URL=postgresql://sms_user:sms_password@localhost:5432/student_management
```

## Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://localhost:8000/docs

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

The Vite dev server proxies `/api` requests to the FastAPI backend.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats/dashboard` | Dashboard statistics |
| GET | `/api/students` | List students (search, filter, sort, paginate) |
| GET | `/api/students/{id}` | Get one student |
| POST | `/api/students` | Create student |
| PUT | `/api/students/{id}` | Update student |
| DELETE | `/api/students/{id}` | Delete student |
| GET | `/api/students/courses` | Distinct courses |

Query params for list: `page`, `page_size`, `search`, `gender`, `course`, `year`, `sort_by`, `sort_order`

## Student Fields

- Full name, Gender, Date of birth
- Email (unique), Phone
- Course/program, Year of study
- Address, Date registered (auto)

## License

MIT – for internship / portfolio use.
