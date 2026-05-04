import { createDatabaseContext } from '../infra/database/database-context.js';
import { AuthController } from '../modules/auth/controllers/auth.controller.js';
import { AuthService } from '../modules/auth/services/auth.service.js';
import { JwtService } from '../modules/auth/services/jwt.service.js';
import { PasswordService } from '../modules/auth/services/password.service.js';
import { HealthController } from '../modules/health/controllers/health.controller.js';
import { HealthService } from '../modules/health/services/health.service.js';
import { ProductController } from '../modules/products/controllers/product.controller.js';
import { SequelizeProductRepository } from '../modules/products/repositories/product.repository.js';
import { ProductService } from '../modules/products/services/product.service.js';
import { UserController } from '../modules/users/controllers/user.controller.js';
import { SequelizeUserRepository } from '../modules/users/repositories/user.repository.js';
import { UserService } from '../modules/users/services/user.service.js';
export const createContainer = (env, overrides = {}) => {
    const databaseContext = overrides.databaseContext ?? createDatabaseContext(env);
    const jwtService = new JwtService(env.jwtSecret, env.jwtExpiresInSeconds);
    const passwordService = new PasswordService();
    const userRepository = new SequelizeUserRepository(databaseContext.models.User);
    const userService = new UserService(userRepository, passwordService);
    const userController = new UserController(userService);
    const authService = new AuthService(jwtService, userService, env.jwtExpiresInSeconds);
    const authController = new AuthController(authService);
    const healthService = new HealthService(env);
    const healthController = new HealthController(healthService);
    const productRepository = new SequelizeProductRepository(databaseContext.models.Product);
    const productService = new ProductService(productRepository);
    const productController = new ProductController(productService);
    return {
        authController,
        jwtService,
        userService,
        userController,
        healthController,
        productController,
        databaseContext
    };
};
