import { Router } from 'express';
import { asyncHandler } from '@/common/middlewares/async-handler.middleware.js';
import { validateRequest } from '@/common/middlewares/validation/validate-request.middleware.js';
import type { AuthController } from '@/modules/auth/controllers/auth.controller.js';
import { loginRequestDto } from '@/modules/auth/dtos/login.dto.js';

export const createAuthRouter = (authController: AuthController): Router => {
  const router = Router();

  /**
   * @openapi
   * /auth/login:
   *   post:
   *     summary: Issue a JWT for an active user
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *           examples:
   *             AdminLoginExample:
   *               value:
   *                 email: super@example.com
   *                 password: change-this-password
   *     responses:
   *       '200':
   *         description: Login succeeded
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LoginSuccessResponse'
   *       '401':
   *         description: Invalid credentials
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
  router.post('/login', validateRequest(loginRequestDto), asyncHandler(authController.login));

  return router;
};
