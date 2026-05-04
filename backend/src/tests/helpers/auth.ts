import { randomUUID } from 'node:crypto';
import type { DatabaseContext } from '@/infra/database/database-context.js';
import type { UserRole } from '@/modules/auth/auth.types.js';
import { JwtService } from '@/modules/auth/services/jwt.service.js';
import { PasswordService } from '@/modules/auth/services/password.service.js';
import { createTestEnv } from './test-env.js';

export const seedUser = async (
  database: DatabaseContext,
  overrides: Partial<{
    name: string;
    email: string;
    password: string;
    role: UserRole;
    isActive: boolean;
  }> = {}
) => {
  const passwordService = new PasswordService();

  return database.models.User.create({
    name: overrides.name ?? 'Test User',
    email: overrides.email ?? `${overrides.role ?? 'viewer'}-${randomUUID()}@example.com`,
    passwordHash: passwordService.hash(overrides.password ?? 'password123'),
    role: overrides.role ?? 'viewer',
    isActive: overrides.isActive ?? true
  });
};

export const createAuthHeader = (user: { id: string; email: string; role: UserRole }): string => {
  const env = createTestEnv();
  const jwtService = new JwtService(env.jwtSecret, env.jwtExpiresInSeconds);

  return `Bearer ${jwtService.sign(user)}`;
};

export const seedAuthHeader = async (database: DatabaseContext, role: UserRole = 'super_admin'): Promise<string> => {
  const user = await seedUser(database, { role });

  return createAuthHeader({
    id: user.id,
    email: user.email,
    role: user.role
  });
};
