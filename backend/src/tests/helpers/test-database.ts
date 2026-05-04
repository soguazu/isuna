import type { DatabaseContext } from '@/infra/database/database-context.js';
import { createDatabaseContext } from '@/infra/database/database-context.js';
import { createTestEnv } from './test-env.js';

export const createTestDatabase = async (): Promise<DatabaseContext> => {
  const database = createDatabaseContext(createTestEnv());

  await database.sequelize.sync({ force: true });

  return database;
};
