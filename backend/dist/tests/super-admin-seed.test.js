import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PasswordService } from '../modules/auth/services/password.service.js';
import { SequelizeUserRepository } from '../modules/users/repositories/user.repository.js';
import { UserService } from '../modules/users/services/user.service.js';
import { createTestDatabase } from './helpers/test-database.js';
describe('Super admin seeding', () => {
    let database;
    beforeEach(async () => {
        database = await createTestDatabase();
    });
    afterEach(async () => {
        await database.sequelize.close();
    });
    it('creates one active super admin and is idempotent', async () => {
        const userService = new UserService(new SequelizeUserRepository(database.models.User), new PasswordService());
        await userService.ensureSuperAdmin({
            name: 'Root Admin',
            email: 'root@example.com',
            password: 'strong-password'
        });
        await userService.ensureSuperAdmin({
            name: 'Root Admin',
            email: 'root@example.com',
            password: 'strong-password'
        });
        const users = await database.models.User.findAll({ where: { role: 'super_admin' } });
        expect(users).toHaveLength(1);
        expect(users[0]).toMatchObject({
            name: 'Root Admin',
            email: 'root@example.com',
            role: 'super_admin',
            isActive: true
        });
    });
});
