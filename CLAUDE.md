# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Isuna** is a product management system with an Express/SQLite backend and a React 19/Vite frontend (frontend UI is not yet implemented — chunks F0–F7 are pending).

## Commands

### Backend (`cd backend`)
```bash
npm run dev              # Watch mode via tsx
npm run build            # Compile TypeScript + rewrite path aliases (tsc + tsc-alias)
npm run lint             # ESLint flat config check
npm test                 # Vitest tests (all)
npm run db:migrate       # Apply pending Sequelize migrations
npm run db:migrate:undo  # Undo last migration
npm run db:seed:dev      # Seed super admin (dev only)
```

### Frontend (`cd frontend`)
```bash
npm run dev     # Vite dev server on port 5173
npm run build   # TypeScript + Vite production build
```

### Full stack
```bash
docker-compose up   # Backend on :4000, frontend on :5173, SQLite in named volume
```

## Architecture

The backend follows a layered, module-per-feature structure with explicit dependency injection. There are three domain modules: **auth**, **products**, and **users**, plus a lightweight **health** module.

**DI Composition Root**: All services, repositories, and controllers are wired exactly once in `backend/src/container/create-container.ts`. There is no DI framework — dependencies are passed via constructor injection.

**Request flow**: `routes/v1/index.ts` → module routes → validation middleware (Zod DTO) → async handler → controller → service → repository (Sequelize).

**Validation**: Every request body and query string is validated by a Zod schema defined in the module's `dtos/` folder. Errors surface as structured `{ code, message, details }` JSON via the global error middleware in `common/middlewares/`.

**Database**: Sequelize + SQLite with `paranoid: true` (soft deletes) on users and products. Migrations live in `src/migrations/`.

**Testing**: Vitest + Supertest. Each test creates an in-memory SQLite database (not the file-based one) via test helpers in `src/tests/`. See existing `*.test.ts` files for patterns.

**Import aliases**: `@/*` resolves to `src/*`. `tsc-alias` rewrites these in the compiled output.

**Swagger**: OpenAPI spec is generated at startup; interactive docs are at `http://localhost:4000/api/v1/docs/`.

## Roles & Permissions (ABAC/RBAC)

| Role | products:read | products:write | users:read | users:write | user:create |
|------|:---:|:---:|:---:|:---:|:---:|
| super_admin | ✓ | ✓ | ✓ | ✓ | ✓ |
| admin | ✓ | ✓ | ✓ | ✗ | ✗ |
| manager | ✓ | ✓ | ✗ | ✗ | ✗ |
| viewer | ✓ | ✗ | ✗ | ✗ | ✗ |

Permission checks live in `backend/src/modules/auth/middlewares/`.

## Environment

**`backend/.env`** (copy from `.env.example`):
```
NODE_ENV=development
PORT=4000
DATABASE_PATH=./data/database.sqlite
JWT_SECRET=...
JWT_EXPIRES_IN_SECONDS=3600
SUPER_ADMIN_EMAIL=super@example.com
SUPER_ADMIN_PASSWORD=...
```

**`frontend/.env`**:
```
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

## Implementation Status

See `IMPLEMENTATION_TRACKER.md` for chunk-by-chunk status. Backend (B0–B11) and Docker Compose (D1) are complete. Frontend (F0–F7) and final docs/QA (D2–D3) are pending.
