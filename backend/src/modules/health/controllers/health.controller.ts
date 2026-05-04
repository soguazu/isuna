import type { Request, Response } from 'express';
import type { SuccessResponse } from '@/common/types/http.js';
import type { HealthStatus, HealthService } from '@/modules/health/services/health.service.js';

export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  show = (_request: Request, response: Response<SuccessResponse<HealthStatus>>): void => {
    response.status(200).json({
      success: true,
      data: this.healthService.getStatus()
    });
  };
}
