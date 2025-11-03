#  To-Do App (Django REST + React + TypeScript + Tailwind)
A small full-stack To-Do application that demonstrates a clean REST API, search/filter/sort, pagination, and a responsive UI.

## Features
- CRUD for todos
- Fields: `title` (required), `description` (optional), `status` (`offen` | `in_bearbeitung` | `erledigt`)
- Search, status filter, sorting (by `title` or `status`, asc/desc)
- Pagination (page number, size = 10)
- No authentication (by design for the task)
- Responsive UI (Tailwind), light/dark theme, basic i18n (de/en)

## Tech Stack
- Backend: Python, Django, Django REST Framework, SQLite (default)
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Tooling: ESLint + Prettier, GitHub Actions CI

## Getting Started

### Backend
Requirements: Python 3.10+ (3.12 works), pip/venv

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```
Runs at `http://127.0.0.1:8000/` (API base: `http://127.0.0.1:8000/api/`).

### Frontend
Requirements: Node 20+, npm

```bash
cd ../frontend
npm install
# Optional: set API base for the client
# echo "VITE_API_BASE_URL=http://127.0.0.1:8000/api" > .env
npm run dev
```
Vite dev server typically at `http://localhost:5173`.

## API Reference
Base URL: `/api` • Todos endpoint: `/api/todos/`

**List**
```
GET /api/todos/?search=<q>&status=<offen|in_bearbeitung|erledigt>&ordering=<title|-title|status|-status>&page=<n>
```
- `search`: full-text over `title`, `description`, `status`
- `status`: exact filter
- `ordering`: `title`/`status` (prefix `-` for descending)
- Pagination: PageNumberPagination (size = 10). DRF may return a list or:
```json
{"count":23,"next":"...","previous":null,"results":[{"id":1,"title":"...","description":"...","status":"offen"}]}
```

**Create**
```
POST /api/todos/
Content-Type: application/json

{
  "title": "Buy milk",
  "description": "2% organic",
  "status": "offen"   // optional; default = "offen"
}
```
- `201 Created` on success; `400 Bad Request` if `title` is empty/whitespace/too long.

**Retrieve**
```
GET /api/todos/:id/
```

**Update**
```
PUT /api/todos/:id/
Content-Type: application/json

{
  "title": "Buy milk and eggs",
  "description": "Add 12 eggs",
  "status": "in_bearbeitung"
}
```

**Partial Update**
```
PATCH /api/todos/:id/
```

**Delete**
```
DELETE /api/todos/:id/
```
- `204 No Content` on success

## Configuration
- Database: SQLite by default (`backend/db.sqlite3`). For PostgreSQL, adjust `DATABASES` in Django settings.
- CORS: open for demo purposes.
- Auth: intentionally disabled for this task.

## Development Notes
- Validation: backend trims `title`; empty titles are rejected with `400`.
- Search/Sort: implemented with DRF `SearchFilter` and `OrderingFilter`.
- Frontend: Axios client uses `VITE_API_BASE_URL` (default: `http://127.0.0.1:8000/api`); components split into `TodoForm`, `TodoList`, `Controls`, `EditModal`, `Header`, etc.; responsive Tailwind layout, theme toggle, i18n (de/en).

## Testing
Backend tests (if present) run via:
```bash
cd backend
python manage.py test -v 2
```

## CI (GitHub Actions)
Pipeline runs on push/PR. Backend job installs deps, checks that migrations are committed (`makemigrations --check --dry-run`), runs `migrate`, then `test`. Frontend job runs `npm ci`, `lint`, `build`.
Example steps (already configured):
```yaml
- name: Check migrations are committed
  run: python manage.py makemigrations --check --dry-run
- name: Migrate (sanity)
  run: python manage.py migrate --noinput
```

## Migrations & SQLite
This repo commits Django migrations and does **not** track the SQLite file.
First run (or after model changes):
```bash
python manage.py makemigrations
python manage.py migrate
```
To ensure schema and migrations are in sync:
```bash
python manage.py makemigrations --check --dry-run
python manage.py showmigrations
```
Minimum `.gitignore` entry:
```
/backend/db.sqlite3
```
If `db.sqlite3` was committed previously:
```bash
git rm --cached backend/db.sqlite3
git add .gitignore
git commit -m "chore: ignore local SQLite db"
```

## Troubleshooting
- CORS or network errors: ensure `VITE_API_BASE_URL` matches the backend URL and backend is running.
- Pagination shape differences: frontend works with both plain lists and `{ results: [...] }`.
- Port conflicts: change Vite or Django ports as needed.

