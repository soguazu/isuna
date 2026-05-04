import { z } from 'zod';
export const retrieveProductParamsDto = z.object({
    id: z.string().uuid('Product id must be a valid UUID')
});
export const retrieveProductRequestDto = z.object({
    params: retrieveProductParamsDto
});
