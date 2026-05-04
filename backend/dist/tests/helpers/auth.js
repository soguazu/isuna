import { randomUUID } from 'node:crypto';
import { JwtService } from '../../modules/auth/services/jwt.service.js';
import { PasswordService } from '../../modules/auth/services/password.service.js';
import { createTestEnv } from './test-env.js';
export const seedUser = async (database, overrides = {}) => {
    const passwordService = new PasswordService();
    return database.models.User.create({
        name: overrides.name ?? 'Test User',
        email: overrides.email ?? `${overrides.role ?? 'viewer'}-${randomUUID()}@example.com`,
        passwordHash: passwordService.hash(overrides.password ?? 'password123'),
        role: overrides.role ?? 'viewer',
        isActive: overrides.isActive ?? true
    });
};
export const createAuthHeader = (user) => {
    const env = createTestEnv();
    const jwtService = new JwtService(env.jwtSecret, env.jwtExpiresInSeconds);
    return `Bearer ${jwtService.sign(user)}`;
};
export const seedAuthHeader = async (database, role = 'super_admin') => {
    const user = await seedUser(database, { role });
    return createAuthHeader({
        id: user.id,
        email: user.email,
        role: user.role
    });
};
