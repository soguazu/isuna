import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodError, ZodObject, ZodTypeAny } from 'zod';
import { ApiError, type ApiErrorDetail } from '@/common/errors/api-error.js';

export type RequestValidationSchema = ZodObject<{
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}>;

type ParsedRequestParts = {
  body?: unknown;
  query?: Request['query'];
  params?: Request['params'];
};

type ValidatableRequest = Request<Request['params'], unknown, unknown, Request['query']>;

const toValidationErrors = (error: ZodError): ApiErrorDetail[] =>
  error.issues.map((issue) => {
    const [, ...fieldPath] = issue.path;

    return {
      path: fieldPath.join('.') || String(issue.path[0] ?? 'request'),
      message: issue.message
    };
  });

export const validateRequest = (schema: RequestValidationSchema): RequestHandler => {
  return (request: ValidatableRequest, _response: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: request.body,
      query: request.query,
      params: request.params
    });

    if (!result.success) {
      next(new ApiError('Validation failed', 422, toValidationErrors(result.error)));
      return;
    }

    const parsedData = result.data as ParsedRequestParts;

    request.body = parsedData.body ?? request.body;
    request.query = parsedData.query ?? request.query;
    request.params = parsedData.params ?? request.params;

    next();
  };
};
