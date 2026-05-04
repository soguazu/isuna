import type { Sequelize } from 'sequelize';
import { initProductModel } from '@/modules/products/models/product.model.js';
import type { ProductModel } from '@/modules/products/models/product.model.js';
import { initUserModel } from '@/modules/users/models/user.model.js';
import type { UserModel } from '@/modules/users/models/user.model.js';

export type AppModels = {
  Product: typeof ProductModel;
  User: typeof UserModel;
};

export const initModels = (sequelize: Sequelize): AppModels => ({
  Product: initProductModel(sequelize),
  User: initUserModel(sequelize)
});
