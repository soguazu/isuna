import { Router } from 'express';
import type { HealthController } from '@/modules/health/controllers/health.controller.js';

export const createHealthRouter = (healthController: HealthController): Router => {
  const router = Router();

  /**
   * @openapi
   * /health:
   *   get:
   *     summary: Check API health
   *     tags:
   *       - Health
   *     responses:
   *       '200':
   *         description: API health status
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/HealthSuccessResponse'
   *             examples:
   *               HealthStatusExample:
   *                 value:
   *                   success: true
   *                   data:
   *                     status: ok
   *                     apiVersion: v1
   *                     environment: development
   *                     uptime: 123.45
   *                     timestamp: '2026-05-04T10:00:00.000Z'
   */
  router.get('/health', healthController.show);

  return router;
};
