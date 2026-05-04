import { initProductModel } from '../models/product.model.js';
export const initModels = (sequelize) => ({
    Product: initProductModel(sequelize)
});
