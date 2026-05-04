import type { UserRole } from '@/modules/auth/auth.types.js';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type UserWithPassword = User & {
  passwordHash: string;
};

export type CreateUserData = {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive?: boolean;
};

export type UpdateUserData = Partial<{
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
}>;

export type UserRepository = {
  create(data: CreateUserData): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<UserWithPassword | null>;
  updateById(id: string, data: UpdateUserData): Promise<User | null>;
};
