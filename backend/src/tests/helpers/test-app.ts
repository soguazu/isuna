import type { Express } from 'express';
import { createApp } from '@/app.js';
import type { AppEnv } from '@/config/env.js';
import type { DatabaseContext } from '@/infra/database/database-context.js';
import { createTestEnv } from './test-env.js';

export type CreateTestAppOptions = Partial<AppEnv> & {
  databaseContext?: DatabaseContext;
};

export const createTestApp = ({ databaseContext, ...envOverrides }: CreateTestAppOptions = {}): Express => {
  const env = createTestEnv(envOverrides);

  return createApp(env, { databaseContext });
};
