# Isuna

Product management system with an Express/SQLite backend and a React/Vite frontend.

## Run With Docker Compose

```bash
docker compose up --build
```

Services:

```txt
Frontend: http://localhost:5173
Backend:  http://localhost:4000/api/v1
Swagger:  http://localhost:4000/api/v1/docs/
```

Compose uses the `backend-data` named volume for SQLite persistence. The backend container runs migrations before starting the API.

## Local Backend Checks

```bash
cd backend
npm run lint
npm run build
npm test
npm run db:migrate
```

## Local Frontend Check

```bash
cd frontend
npm install
npm run build
```
