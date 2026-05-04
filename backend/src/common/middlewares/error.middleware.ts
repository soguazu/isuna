import type { ErrorRequestHandler } from 'express';
import { ApiError } from '@/common/errors/api-error.js';
import type { ErrorResponse } from '@/common/types/http.js';

type HttpError = {
  statusCode?: unknown;
  message?: unknown;
};

const isHttpError = (error: unknown): error is HttpError =>
  typeof error === 'object' && error !== null;

const toStatusCode = (error: unknown): number => {
  if (!isHttpError(error) || typeof error.statusCode !== 'number') {
    return 500;
  }

  return Number.isInteger(error.statusCode) && error.statusCode >= 400 && error.statusCode <= 599 ? error.statusCode : 500;
};

const shouldLogError = (statusCode: number): boolean => statusCode >= 500 && process.env.NODE_ENV !== 'test';

export const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next): void => {
  const statusCode = toStatusCode(error);
  const message =
    statusCode === 500 || !isHttpError(error) || typeof error.message !== 'string'
      ? 'Internal server error'
      : error.message;

  if (shouldLogError(statusCode)) {
    console.error('Unhandled request error', error);
  }

  response.status(statusCode).json({
    success: false,
    message,
    ...(error instanceof ApiError && error.errors.length > 0 ? { errors: error.errors } : {})
  } satisfies ErrorResponse);
};
