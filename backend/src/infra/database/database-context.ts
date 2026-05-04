import type { Sequelize } from 'sequelize';
import type { AppEnv } from '@/config/env.js';
import { createSequelize } from '@/infra/database/sequelize.js';
import { initModels, type AppModels } from '@/modules/products/models/index.js';

export type DatabaseContext = {
  sequelize: Sequelize;
  models: AppModels;
};

export const createDatabaseContext = (env: AppEnv): DatabaseContext => {
  const sequelize = createSequelize(env);
  const models = initModels(sequelize);

  return {
    sequelize,
    models
  };
};
