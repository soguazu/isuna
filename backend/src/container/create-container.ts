import type { AppEnv } from '@/config/env.js';
import { createDatabaseContext } from '@/infra/database/database-context.js';
import type { DatabaseContext } from '@/infra/database/database-context.js';
import { HealthController } from '@/modules/health/controllers/health.controller.js';
import { HealthService } from '@/modules/health/services/health.service.js';
import { ProductController } from '@/modules/products/controllers/product.controller.js';
import { SequelizeProductRepository } from '@/modules/products/repositories/product.repository.js';
import { ProductService } from '@/modules/products/services/product.service.js';

export type AppContainer = {
  healthController: HealthController;
  productController: ProductController;
  databaseContext: DatabaseContext;
};

export type ContainerOverrides = {
  databaseContext?: DatabaseContext;
};

export const createContainer = (env: AppEnv, overrides: ContainerOverrides = {}): AppContainer => {
  const databaseContext = overrides.databaseContext ?? createDatabaseContext(env);
  const healthService = new HealthService(env);
  const healthController = new HealthController(healthService);
  const productRepository = new SequelizeProductRepository(databaseContext.models.Product);
  const productService = new ProductService(productRepository);
  const productController = new ProductController(productService);

  return {
    healthController,
    productController,
    databaseContext
  };
};
