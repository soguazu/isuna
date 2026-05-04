import { z } from 'zod';
export const loginBodyDto = z.object({
    email: z.string().trim().email('Email must be valid').max(254, 'Email must be at most 254 characters'),
    password: z.string().min(1, 'Password is required')
});
export const loginRequestDto = z.object({
    body: loginBodyDto
});
