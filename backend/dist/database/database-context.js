import { createSequelize } from '../database/sequelize.js';
import { initModels } from '../models/index.js';
export const createDatabaseContext = (env) => {
    const sequelize = createSequelize(env);
    const models = initModels(sequelize);
    return {
        sequelize,
        models
    };
};
