# TC Dine Eval

Dining hall ratings platform for the Thomas Culinary Center. The backend ingests the Sodexo menu feed, enriches it with student reviews, and exposes a REST API that the React frontend consumes.

---

## Repository layout

| Path | Description |
| --- | --- |
| `backend/` | Python code for pulling the menu feed (`APIs/thomas_menu.py`), data classes, FastAPI server, and fallback JSON data (`sample_menu.json`). |
| `ratemymeal_backend.py` | Simple script that fetches the latest menu and writes `thomas_menu.json`. |
| `json_to_AWS.py` | Utility for uploading the enriched menu to DynamoDB (manual use). |
| `tc-dine-eval-frontend/` | React 19 + TypeScript SPA (Vite) with React Router and React Query. |
| `public/menu-sample.json`, `public/reviews-sample.json` | Frontend fallback data for offline development. |

---

## Backend API

### 1. Install dependencies

```bash
cd /Users/kingjames/Desktop/cs365_2025
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. (Optional) Cache the live menu

```bash
python ratemymeal_backend.py
```

> If the live API is unreachable, the server will automatically fall back to `backend/sample_menu.json`.

### 3. Run the FastAPI server

```bash
uvicorn backend.server:app --reload --port 8000
```

#### Available endpoints

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/health` | Basic readiness probe. |
| `GET` | `/menu` | Returns the normalized menu array (`ItemName`, `Meal`, `Group`, `Meta`). |
| `POST` | `/menu/refresh` | Forces a fresh pull from Sodexo before returning data. |
| `GET` | `/reviews?foodItemId=avocado-toast` | Lists stored reviews for a food item. |
| `POST` | `/reviews` | Body: `{ foodItemId, rating (1-5), comment }`. Persists review and returns it. |

Reviews are stored in `reviews.json`. Menu ratings update automatically based on the stored reviews.

---

## Frontend

### 1. Install & set environment

```bash
cd /Users/kingjames/Desktop/cs365_2025/tc-dine-eval-frontend
npm install
cp .env.example .env    # points to http://localhost:8000 by default
```

### 2. Run dev server

```bash
npm run dev
```

The SPA uses:

- React Router for navigation (`/`, `/meal/:mealType`, `/food-item/:foodItemId`)
- React Query (`src/app/queryClient.ts`) for data fetching/caching
- Axios (`src/services/api.ts`) for HTTP calls
- Components/pages under `src/components` and `src/pages`

When `VITE_API_BASE_URL` is defined, the frontend talks to the FastAPI backend. If it’s missing, the app falls back to the bundled JSON sample so you can still iterate on the UI offline.

---

## Connecting frontend to backend

1. Start the FastAPI server (`uvicorn backend.server:app --reload --port 8000`).
2. Ensure the frontend `.env` contains `VITE_API_BASE_URL=http://localhost:8000`.
3. Run `npm run dev` (or `npm run build && npm run preview` for production).

React Query now hits:

- `GET /menu` for `useMeals()`
- `GET /reviews?foodItemId=...`
- `POST /reviews` for new submissions (with optimistic UI updates)

You can deploy both pieces independently; just point `VITE_API_BASE_URL` at the deployed backend URL.

---

## Notes

- Backend dependencies: `requests`, `fastapi`, `uvicorn`, `boto3` (optional DynamoDB upload).
- Frontend dependencies: React 19, React Query, React Router, Axios, Zod.
- Tailwind/tests are not yet wired up; see `TEAM_TASKS.md` for the remaining backlog.
