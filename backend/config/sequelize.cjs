require('dotenv').config();

const databasePath = process.env.DATABASE_PATH || './data/database.sqlite';

const baseConfig = {
  dialect: 'sqlite',
  storage: databasePath,
  logging: false
};

module.exports = {
  development: baseConfig,
  test: {
    ...baseConfig,
    storage: ':memory:'
  },
  production: baseConfig
};
