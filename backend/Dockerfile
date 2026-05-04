FROM node:20-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:20-bookworm-slim AS runtime

ENV NODE_ENV=production
ENV PORT=4000
ENV DATABASE_PATH=/app/data/database.sqlite

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY --from=build /app/dist ./dist
COPY .sequelizerc ./
COPY config ./config
COPY src/migrations ./src/migrations

RUN mkdir -p /app/data && chown -R node:node /app

USER node

EXPOSE 4000

CMD ["sh", "-c", "npm run db:migrate && npm run db:seed && npm start"]
