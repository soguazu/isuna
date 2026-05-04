# Isuna

Product management system with an Express/SQLite backend and a React/Vite frontend.

## Local Setup

Create the backend environment file before running the API:

```bash
cd backend
cp .env.example .env
```

Set the correct values in `backend/.env`:

```txt
NODE_ENV=development
PORT=4000
DATABASE_PATH=./data/database.sqlite
JWT_SECRET=replace-this-with-a-long-random-secret
JWT_EXPIRES_IN_SECONDS=3600
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
SUPER_ADMIN_NAME=Super Admin
SUPER_ADMIN_EMAIL=super@example.com
SUPER_ADMIN_PASSWORD=change-this-password
```

The seeded user is always created with role `super_admin`; the role is not configured through `.env`.

Run the backend:

```bash
npm install
npm run db:migrate
npm run db:seed:dev
npm run dev
```

Backend: `http://localhost:4000/api/v1`

Swagger: `http://localhost:4000/api/v1/docs/`

## Local Backend Checks

```bash
cd backend
npm run lint
npm run build
npm test
npm run db:migrate
npm run db:seed:dev
```

## Demo API Auth

Product reads are public. Product writes require a Bearer token from `POST /api/v1/auth/login`.
The first `super_admin` is seeded from `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD`.

```txt
super_admin # full access, manages users and roles
admin       # product create, update, delete; user read
manager     # product create, update
viewer      # read-only plus own profile
```

## Local Frontend Check

```bash
cd frontend
npm install
npm run build
```
