import type { Sequelize } from 'sequelize';
import { initProductModel } from '@/modules/products/models/product.model.js';
import type { ProductModel } from '@/modules/products/models/product.model.js';

export type AppModels = {
  Product: typeof ProductModel;
};

export const initModels = (sequelize: Sequelize): AppModels => ({
  Product: initProductModel(sequelize)
});
