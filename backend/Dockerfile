FROM node:20-bookworm-slim AS build

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

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
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && npm ci --include=dev \
    && apt-get purge -y --auto-remove python3 make g++ \
    && rm -rf /var/lib/apt/lists/* /root/.npm

COPY --from=build /app/dist ./dist
COPY .sequelizerc ./
COPY config ./config
COPY src/migrations ./src/migrations

RUN mkdir -p /app/data && chown -R node:node /app

USER node

EXPOSE 4000

CMD ["sh", "-c", "npm run db:migrate && npm run db:seed && npm start"]
