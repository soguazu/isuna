import type { AppEnv } from '@/config/env.js';

export const createTestEnv = (overrides: Partial<AppEnv> = {}): AppEnv => ({
  nodeEnv: 'test',
  port: 4000,
  databasePath: ':memory:',
  redisUrl: 'redis://localhost:6379',
  jwtSecret: 'test-secret',
  jwtExpiresInSeconds: 3600,
  rateLimitWindowMs: 60_000,
  rateLimitMaxRequests: 100,
  superAdminName: 'Test Super Admin',
  superAdminEmail: 'super@example.com',
  superAdminPassword: 'strong-password',
  ...overrides
});
