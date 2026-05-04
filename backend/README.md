# Isuna Backend

Express + TypeScript API for product management. The API is versioned under `/api/v1` and uses Sequelize with SQLite.

## Local Setup

```bash
npm install
cp .env.example .env
npm run db:migrate
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
npm run lint         # Run ESLint
npm test             # Run Vitest
```

## Environment

```txt
NODE_ENV=development
PORT=4000
DATABASE_PATH=./data/database.sqlite
```

For tests, SQLite runs in memory through the test helpers.

## Docker

Build the backend image:

```bash
docker build -t isuna-backend .
```

Run with a named volume for SQLite persistence:

```bash
docker run --rm \
  -p 4000:4000 \
  -v isuna-backend-data:/app/data \
  isuna-backend
```

The container runs `npm run db:migrate` before `npm start`, so a fresh SQLite volume is initialized automatically.

## API Surface

```txt
GET    /api/v1/health
GET    /api/v1/products
POST   /api/v1/products
GET    /api/v1/products/:id
PATCH  /api/v1/products/:id
DELETE /api/v1/products/:id
```

Product reads exclude soft-deleted rows by default.
