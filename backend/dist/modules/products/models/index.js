import { initProductModel } from '../../../modules/products/models/product.model.js';
import { initUserModel } from '../../../modules/users/models/user.model.js';
export const initModels = (sequelize) => ({
    Product: initProductModel(sequelize),
    User: initUserModel(sequelize)
});
