# Isuna Backend

Express + TypeScript API for product management. The API is versioned under `/api/v1` and uses Sequelize with SQLite.

## Local Setup

```bash
npm install
cp .env.example .env
```

Set the correct values in `.env` before running migrations or seeding:

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

Then run:

```bash
npm run db:migrate
npm run db:seed:dev
npm run dev
```

Default local URL:

```txt
http://localhost:4000/api/v1
```

Swagger UI:

```txt
http://localhost:4000/api/v1/docs/
```

## Scripts

```bash
npm run dev          # Start the TypeScript dev server
npm run build        # Compile TypeScript and rewrite path aliases
npm start            # Run the compiled API from dist/
npm run db:migrate   # Apply Sequelize migrations
npm run db:seed:dev  # Seed the first super admin in local TypeScript mode
npm run lint         # Run ESLint
npm test             # Run Vitest
```

## Environment Reference

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

For tests, SQLite runs in memory through the test helpers.

`JWT_SECRET` is required when `NODE_ENV=production`. Development and test use safe local defaults when it is omitted.

## Auth And Roles

Product reads are public. Product writes require a Bearer token from `POST /api/v1/auth/login`.
The first `super_admin` is seeded from `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD`.

```txt
super_admin # full access, manages users and roles
admin       # product create, update, delete; user read
manager     # product create, update
viewer      # read-only plus own profile
```

### Permission Matrix

| Permission | super_admin | admin | manager | viewer |
| --- | --- | --- | --- | --- |
| `products:read` | yes | yes | yes | yes |
| `products:create` | yes | yes | yes | no |
| `products:update` | yes | yes | yes | no |
| `products:delete` | yes | yes | no | no |
| `users:read:list` | yes | yes | no | no |
| `users:read:any` | yes | yes | no | no |
| `users:create` | yes | no | no | no |
| `users:update:any` | yes | no | no | no |
| `users:disable` | yes | no | no | no |

### ABAC Profile Rules

| Action | Rule |
| --- | --- |
| View own profile | Allowed when `actor.id === targetUser.id` |
| Update own profile | Allowed when `actor.id === targetUser.id`; only `name`, `email`, and `password` are applied |
| View another user | Allowed for `super_admin` and `admin` |
| Update another user | Allowed for `super_admin` |
| Disable another user | Allowed for `super_admin` |
| Disable self | Never allowed |

### User Table

| Column | Purpose |
| --- | --- |
| `id` | UUID primary key |
| `name` | Display name |
| `email` | Unique login email |
| `password_hash` | Scrypt password hash |
| `role` | `super_admin`, `admin`, `manager`, or `viewer` |
| `is_active` | Disabled users cannot log in or authenticate |
| `created_at` / `updated_at` / `deleted_at` | Timestamps and soft delete metadata |

## API Surface

```txt
GET    /api/v1/health
POST   /api/v1/auth/login
GET    /api/v1/me
PATCH  /api/v1/me
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/:id
PATCH  /api/v1/users/:id
PATCH  /api/v1/users/:id/disable
GET    /api/v1/products
POST   /api/v1/products
GET    /api/v1/products/:id
PATCH  /api/v1/products/:id
DELETE /api/v1/products/:id
```

Product reads exclude soft-deleted rows by default.
