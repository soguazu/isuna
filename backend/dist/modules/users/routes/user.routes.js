import { Router } from 'express';
import { asyncHandler } from '../../../common/middlewares/async-handler.middleware.js';
import { validateRequest } from '../../../common/middlewares/validation/validate-request.middleware.js';
import { authorizePermission } from '../../../modules/auth/middlewares/authorize-permission.middleware.js';
import { createUserRequestDto, retrieveUserRequestDto, updateMeRequestDto, updateUserRequestDto } from '../../../modules/users/dtos/user.dto.js';
export const createUserRouter = (userController, authenticate) => {
    const router = Router();
    /**
     * @openapi
     * /me:
     *   get:
     *     summary: Retrieve current user profile
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       '200':
     *         description: Current user profile
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UserSuccessResponse'
     *       '401':
     *         description: Authentication required
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.get('/me', authenticate, asyncHandler(userController.me));
    /**
     * @openapi
     * /me:
     *   patch:
     *     summary: Update current user profile
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateUserRequest'
     *     responses:
     *       '200':
     *         description: Current user profile updated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UserSuccessResponse'
     *       '401':
     *         description: Authentication required
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
    router.patch('/me', authenticate, validateRequest(updateMeRequestDto), asyncHandler(userController.updateMe));
    /**
     * @openapi
     * /users:
     *   get:
     *     summary: List users
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       '200':
     *         description: Users listed
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UserListSuccessResponse'
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
     */
    router.get('/users', authenticate, authorizePermission('users:read:list'), asyncHandler(userController.list));
    /**
     * @openapi
     * /users:
     *   post:
     *     summary: Create user
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateUserRequest'
     *     responses:
     *       '201':
     *         description: User created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UserSuccessResponse'
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
     *       '409':
     *         description: Email already exists
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
    router.post('/users', authenticate, authorizePermission('users:create'), validateRequest(createUserRequestDto), asyncHandler(userController.create));
    /**
     * @openapi
     * /users/{id}:
     *   get:
     *     summary: Retrieve user
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - $ref: '#/components/parameters/UserIdPathParameter'
     *     responses:
     *       '200':
     *         description: User retrieved
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UserSuccessResponse'
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
     *       '404':
     *         description: User not found
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
    router.get('/users/:id', authenticate, validateRequest(retrieveUserRequestDto), asyncHandler(userController.retrieve));
    /**
     * @openapi
     * /users/{id}:
     *   patch:
     *     summary: Update user
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - $ref: '#/components/parameters/UserIdPathParameter'
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateUserRequest'
     *     responses:
     *       '200':
     *         description: User updated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UserSuccessResponse'
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
     *       '404':
     *         description: User not found
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
    router.patch('/users/:id', authenticate, validateRequest(updateUserRequestDto), asyncHandler(userController.update));
    /**
     * @openapi
     * /users/{id}/disable:
     *   patch:
     *     summary: Disable user
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - $ref: '#/components/parameters/UserIdPathParameter'
     *     responses:
     *       '200':
     *         description: User disabled
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UserSuccessResponse'
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
     *       '404':
     *         description: User not found
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
    router.patch('/users/:id/disable', authenticate, validateRequest(retrieveUserRequestDto), asyncHandler(userController.disable));
    return router;
};
