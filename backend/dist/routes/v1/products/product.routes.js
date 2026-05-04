import { Router } from 'express';
import { createProductRequestDto } from '../../../dtos/products/create-product.dto.js';
import { asyncHandler } from '../../../middlewares/async-handler.middleware.js';
import { validateRequest } from '../../../middlewares/validation/validate-request.middleware.js';
export const createProductRouter = (productController) => {
    const router = Router();
    /**
     * @openapi
     * /products:
     *   post:
     *     summary: Create a product
     *     tags:
     *       - Products
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateProductRequest'
     *           example:
     *             name: Wireless Mouse
     *             description: Ergonomic mouse with USB-C charging
     *             price: 59.99
     *             stockQuantity: 25
     *     responses:
     *       '201':
     *         description: Product created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ProductSuccessResponse'
     *       '422':
     *         description: Validation failed
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.post('/', validateRequest(createProductRequestDto), asyncHandler(productController.create));
    return router;
};
