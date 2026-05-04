import { createSequelize } from '../../infra/database/sequelize.js';
import { initModels } from '../../modules/products/models/index.js';
export const createDatabaseContext = (env) => {
    const sequelize = createSequelize(env);
    const models = initModels(sequelize);
    return {
        sequelize,
        models
    };
};
