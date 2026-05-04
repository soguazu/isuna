import dotenv from 'dotenv';

dotenv.config();

export type AppEnv = {
  nodeEnv: string;
  port: number;
  databasePath: string;
};

const parsePort = (value: string | undefined): number => {
  const port = Number(value ?? 4000);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('PORT must be a positive integer');
  }

  return port;
};

export const loadEnv = (): AppEnv => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parsePort(process.env.PORT),
  databasePath: process.env.DATABASE_PATH ?? './data/database.sqlite'
});

