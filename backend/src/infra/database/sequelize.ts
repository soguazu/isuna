import { Sequelize } from 'sequelize';
import type { AppEnv } from '@/config/env.js';

export const createSequelize = (env: AppEnv): Sequelize =>
  new Sequelize({
    dialect: 'sqlite',
    storage: env.databasePath,
    logging: false
  });

