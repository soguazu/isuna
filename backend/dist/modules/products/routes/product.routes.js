import { Router } from 'express';
import { asyncHandler } from '../../../common/middlewares/async-handler.middleware.js';
import { validateRequest } from '../../../common/middlewares/validation/validate-request.middleware.js';
import { authorizePermission } from '../../../modules/auth/middlewares/authorize-permission.middleware.js';
import { createProductRequestDto } from '../../../modules/products/dtos/create-product.dto.js';
import { listProductsRequestDto } from '../../../modules/products/dtos/list-products.dto.js';
import { retrieveProductRequestDto } from '../../../modules/products/dtos/retrieve-product.dto.js';
import { updateProductRequestDto } from '../../../modules/products/dtos/update-product.dto.js';
export const createProductRouter = (productController, authenticate) => {
    const router = Router();
    /**
     * @openapi
     * /products:
     *   get:
     *     summary: List products
     *     tags:
     *       - Products
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 1
     *       - in: query
     *         name: pageSize
     *         schema:
     *           type: integer
     *           minimum: 1
     *           maximum: 100
     *           default: 10
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *           maxLength: 120
     *     responses:
     *       '200':
     *         description: Products listed
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ProductListSuccessResponse'
     *             examples:
     *               ProductListExample:
     *                 value:
     *                   success: true
     *                   data:
     *                     - id: 8d1f3f25-7f9b-4c0f-a3a5-5e3f8f3c9a10
     *                       name: Wireless Mouse
     *                       description: Ergonomic mouse with USB-C charging
     *                       price: 59.99
     *                       stockQuantity: 25
     *                       createdAt: '2026-05-04T10:00:00.000Z'
     *                       updatedAt: '2026-05-04T10:00:00.000Z'
     *                       deletedAt: null
     *                   meta:
     *                     page: 1
     *                     pageSize: 10
     *                     totalItems: 1
     *                     totalPages: 1
     *       '422':
     *         description: Validation failed
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.get('/', validateRequest(listProductsRequestDto), asyncHandler(productController.list));
    /**
     * @openapi
     * /products/{id}:
     *   get:
     *     summary: Retrieve a product
     *     tags:
     *       - Products
     *     parameters:
     *       - $ref: '#/components/parameters/ProductIdPathParameter'
     *     responses:
     *       '200':
     *         description: Product retrieved
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ProductSuccessResponse'
     *             examples:
     *               ProductExample:
     *                 value:
     *                   success: true
     *                   data:
     *                     id: 8d1f3f25-7f9b-4c0f-a3a5-5e3f8f3c9a10
     *                     name: Wireless Mouse
     *                     description: Ergonomic mouse with USB-C charging
     *                     price: 59.99
     *                     stockQuantity: 25
     *                     createdAt: '2026-05-04T10:00:00.000Z'
     *                     updatedAt: '2026-05-04T10:00:00.000Z'
     *                     deletedAt: null
     *       '404':
     *         description: Product not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       '422':
     *         description: Validation failed
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.get('/:id', validateRequest(retrieveProductRequestDto), asyncHandler(productController.retrieve));
    /**
     * @openapi
     * /products/{id}:
     *   patch:
     *     summary: Update a product
     *     tags:
     *       - Products
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - $ref: '#/components/parameters/ProductIdPathParameter'
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateProductRequest'
     *           examples:
     *             UpdateProductExample:
     *               value:
     *                 price: 69.99
     *                 stockQuantity: 20
     *     responses:
     *       '200':
     *         description: Product updated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ProductSuccessResponse'
     *             examples:
     *               ProductExample:
     *                 value:
     *                   success: true
     *                   data:
     *                     id: 8d1f3f25-7f9b-4c0f-a3a5-5e3f8f3c9a10
     *                     name: Wireless Mouse
     *                     description: Ergonomic mouse with USB-C charging
     *                     price: 69.99
     *                     stockQuantity: 20
     *                     createdAt: '2026-05-04T10:00:00.000Z'
     *                     updatedAt: '2026-05-04T10:05:00.000Z'
     *                     deletedAt: null
     *       '404':
     *         description: Product not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       '401':
     *         description: Authentication required
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       '403':
     *         description: Forbidden
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       '422':
     *         description: Validation failed
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.patch('/:id', authenticate, authorizePermission('products:update'), validateRequest(updateProductRequestDto), asyncHandler(productController.update));
    /**
     * @openapi
     * /products/{id}:
     *   delete:
     *     summary: Delete a product
     *     tags:
     *       - Products
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - $ref: '#/components/parameters/ProductIdPathParameter'
     *     responses:
     *       '200':
     *         description: Product deleted
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/DeleteProductSuccessResponse'
     *             examples:
     *               DeleteProductExample:
     *                 value:
     *                   success: true
     *                   data:
     *                     id: 8d1f3f25-7f9b-4c0f-a3a5-5e3f8f3c9a10
     *       '404':
     *         description: Product not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       '401':
     *         description: Authentication required
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       '403':
     *         description: Forbidden
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       '422':
     *         description: Validation failed
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.delete('/:id', authenticate, authorizePermission('products:delete'), validateRequest(retrieveProductRequestDto), asyncHandler(productController.delete));
    /**
     * @openapi
     * /products:
     *   post:
     *     summary: Create a product
     *     tags:
     *       - Products
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateProductRequest'
     *           examples:
     *             CreateProductExample:
     *               value:
     *                 name: Wireless Mouse
     *                 description: Ergonomic mouse with USB-C charging
     *                 price: 59.99
     *                 stockQuantity: 25
     *     responses:
     *       '201':
     *         description: Product created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ProductSuccessResponse'
     *             examples:
     *               ProductExample:
     *                 value:
     *                   success: true
     *                   data:
     *                     id: 8d1f3f25-7f9b-4c0f-a3a5-5e3f8f3c9a10
     *                     name: Wireless Mouse
     *                     description: Ergonomic mouse with USB-C charging
     *                     price: 59.99
     *                     stockQuantity: 25
     *                     createdAt: '2026-05-04T10:00:00.000Z'
     *                     updatedAt: '2026-05-04T10:00:00.000Z'
     *                     deletedAt: null
     *       '401':
     *         description: Authentication required
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       '403':
     *         description: Forbidden
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       '422':
     *         description: Validation failed
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.post('/', authenticate, authorizePermission('products:create'), validateRequest(createProductRequestDto), asyncHandler(productController.create));
    return router;
};
