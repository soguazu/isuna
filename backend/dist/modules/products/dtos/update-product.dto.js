import { z } from 'zod';
import { createProductBodyDto } from '../../../modules/products/dtos/create-product.dto.js';
import { retrieveProductParamsDto } from '../../../modules/products/dtos/retrieve-product.dto.js';
export const updateProductBodyDto = createProductBodyDto.partial().refine((value) => Object.keys(value).length > 0, {
    message: 'At least one product field is required'
});
export const updateProductRequestDto = z.object({
    params: retrieveProductParamsDto,
    body: updateProductBodyDto
});
