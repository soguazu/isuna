import type { Request, Response } from 'express';
import type { ErrorResponse } from '@/common/types/http.js';

export const notFoundMiddleware = (request: Request, response: Response<ErrorResponse>): void => {
  response.status(404).json({
    success: false,
    message: `Route ${request.method} ${request.originalUrl} not found`
  });
};
