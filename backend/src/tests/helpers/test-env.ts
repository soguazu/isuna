import type { AppEnv } from '@/config/env.js';

export const createTestEnv = (overrides: Partial<AppEnv> = {}): AppEnv => ({
  nodeEnv: 'test',
  port: 4000,
  databasePath: ':memory:',
  ...overrides
});

