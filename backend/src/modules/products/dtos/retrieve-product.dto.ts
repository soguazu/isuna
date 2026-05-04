import type { Request } from 'express';
import { z } from 'zod';

export const retrieveProductParamsDto = z.object({
  id: z.string().uuid('Product id must be a valid UUID')
});

export const retrieveProductRequestDto = z.object({
  params: retrieveProductParamsDto
});

export type RetrieveProductParamsDto = z.infer<typeof retrieveProductParamsDto>;

export type RetrieveProductRequest = Request<RetrieveProductParamsDto>;
