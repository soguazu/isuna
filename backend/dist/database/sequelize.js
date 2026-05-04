import { Sequelize } from 'sequelize';
export const createSequelize = (env) => new Sequelize({
    dialect: 'sqlite',
    storage: env.databasePath,
    logging: false
});
