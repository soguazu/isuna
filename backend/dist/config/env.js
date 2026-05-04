import dotenv from 'dotenv';
dotenv.config();
const parsePort = (value) => {
    const port = Number(value ?? 4000);
    if (!Number.isInteger(port) || port <= 0) {
        throw new Error('PORT must be a positive integer');
    }
    return port;
};
const parsePositiveInteger = (name, value, fallback) => {
    const parsedValue = Number(value ?? fallback);
    if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
        throw new Error(`${name} must be a positive integer`);
    }
    return parsedValue;
};
const parseJwtSecret = (nodeEnv) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret) {
        return jwtSecret;
    }
    if (nodeEnv === 'production') {
        throw new Error('JWT_SECRET is required in production');
    }
    return 'isuna-development-secret';
};
export const loadEnv = () => ({
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: parsePort(process.env.PORT),
    databasePath: process.env.DATABASE_PATH ?? './data/database.sqlite',
    jwtSecret: parseJwtSecret(process.env.NODE_ENV ?? 'development'),
    jwtExpiresInSeconds: parsePositiveInteger('JWT_EXPIRES_IN_SECONDS', process.env.JWT_EXPIRES_IN_SECONDS, 3600),
    rateLimitWindowMs: parsePositiveInteger('RATE_LIMIT_WINDOW_MS', process.env.RATE_LIMIT_WINDOW_MS, 60_000),
    rateLimitMaxRequests: parsePositiveInteger('RATE_LIMIT_MAX_REQUESTS', process.env.RATE_LIMIT_MAX_REQUESTS, 100),
    superAdminName: process.env.SUPER_ADMIN_NAME,
    superAdminEmail: process.env.SUPER_ADMIN_EMAIL,
    superAdminPassword: process.env.SUPER_ADMIN_PASSWORD
});
