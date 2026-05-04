import { Router } from 'express';
import type { AppContainer } from '@/container/create-container.js';
import { createHealthRouter } from '@/modules/health/routes/health.routes.js';
import { createProductRouter } from '@/modules/products/routes/product.routes.js';

export const createV1Router = (container: AppContainer): Router => {
  const router = Router();

  router.use(createHealthRouter(container.healthController));
  router.use('/products', createProductRouter(container.productController));

  return router;
};
