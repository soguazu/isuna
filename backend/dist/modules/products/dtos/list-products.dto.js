import { z } from 'zod';
const emptySearchToUndefined = (value) => {
    if (typeof value !== 'string') {
        return value;
    }
    const trimmedValue = value.trim();
    return trimmedValue.length > 0 ? trimmedValue : undefined;
};
export const listProductsQueryDto = z.object({
    page: z.coerce.number().int('Page must be an integer').min(1, 'Page must be at least 1').default(1),
    pageSize: z.coerce
        .number()
        .int('Page size must be an integer')
        .min(1, 'Page size must be at least 1')
        .max(100, 'Page size must be at most 100')
        .default(10),
    search: z.preprocess(emptySearchToUndefined, z.string().max(120, 'Search must be at most 120 characters').optional())
});
export const listProductsRequestDto = z.object({
    query: listProductsQueryDto
});
