import type { ErrorResponse, SuccessResponse } from '@/common/types/http.js';

export const asSuccessBody = <TData, TMeta = undefined>(body: unknown): SuccessResponse<TData, TMeta> =>
  body as SuccessResponse<TData, TMeta>;

export const asErrorBody = (body: unknown): ErrorResponse => body as ErrorResponse;
