import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ParsedQs } from 'qs';

type AsyncRequestHandler<
  TParams = Record<string, string>,
  TResponseBody = unknown,
  TRequestBody = unknown,
  TRequestQuery = ParsedQs
> = (
  request: Request<TParams, TResponseBody, TRequestBody, TRequestQuery>,
  response: Response<TResponseBody>,
  next: NextFunction
) => Promise<void>;

export const asyncHandler =
  <
    TParams = Record<string, string>,
    TResponseBody = unknown,
    TRequestBody = unknown,
    TRequestQuery = ParsedQs
  >(
    handler: AsyncRequestHandler<TParams, TResponseBody, TRequestBody, TRequestQuery>
  ): RequestHandler<TParams, TResponseBody, TRequestBody, TRequestQuery> =>
  (request, response, next): void => {
    void handler(request, response, next).catch(next);
  };
