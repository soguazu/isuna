import { initProductModel } from '../../../modules/products/models/product.model.js';
export const initModels = (sequelize) => ({
    Product: initProductModel(sequelize)
});
