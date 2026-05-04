import { z } from 'zod';
export const createProductBodySchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(120, 'Name must be at most 120 characters'),
    description: z.string().trim().min(1, 'Description is required'),
    price: z.number().positive('Price must be greater than 0'),
    stockQuantity: z.number().int('Stock quantity must be an integer').min(0, 'Stock quantity cannot be negative')
});
export const createProductRequestSchema = z.object({
    body: createProductBodySchema
});
