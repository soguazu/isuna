import { Router } from 'express';
import type { AppContainer } from '@/container/create-container.js';
import { authenticateJwt } from '@/modules/auth/middlewares/authenticate.middleware.js';
import { createAuthRouter } from '@/modules/auth/routes/auth.routes.js';
import { createHealthRouter } from '@/modules/health/routes/health.routes.js';
import { createProductRouter } from '@/modules/products/routes/product.routes.js';
import { createUserRouter } from '@/modules/users/routes/user.routes.js';

export const createV1Router = (container: AppContainer): Router => {
  const router = Router();
  const authenticate = authenticateJwt(container.jwtService, container.userService);

  router.use('/auth', createAuthRouter(container.authController));
  router.use(createHealthRouter(container.healthController));
  router.use(createUserRouter(container.userController, authenticate));
  router.use('/products', createProductRouter(container.productController, authenticate));

  return router;
};
