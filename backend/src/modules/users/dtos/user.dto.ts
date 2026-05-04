import { z } from 'zod';
import { roles } from '@/modules/auth/auth.types.js';

export const userIdParamsDto = z.object({
  id: z.string().uuid('User id must be a valid UUID')
});

export const createUserBodyDto = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120, 'Name must be at most 120 characters'),
  email: z.string().trim().email('Email must be valid').max(254, 'Email must be at most 254 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(roles)
});

export const createUserRequestDto = z.object({
  body: createUserBodyDto
});

export const updateUserBodyDto = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(120, 'Name must be at most 120 characters').optional(),
    email: z.string().trim().email('Email must be valid').max(254, 'Email must be at most 254 characters').optional(),
    password: z.string().min(8, 'Password must be at least 8 characters').optional(),
    role: z.enum(roles).optional(),
    isActive: z.boolean().optional()
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field is required'
  });

export const updateUserRequestDto = z.object({
  params: userIdParamsDto,
  body: updateUserBodyDto
});

export const retrieveUserRequestDto = z.object({
  params: userIdParamsDto
});

export const updateMeRequestDto = z.object({
  body: updateUserBodyDto
});

export type CreateUserBodyDto = z.infer<typeof createUserBodyDto>;
export type UpdateUserBodyDto = z.infer<typeof updateUserBodyDto>;
