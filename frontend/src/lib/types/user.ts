import type { UserRole } from './auth';

export type User = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type UpdateUserInput = Partial<Omit<CreateUserInput, 'password'> & { password: string; isActive: boolean }>;
