import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { asErrorBody, asSuccessBody } from './helpers/http-assertions.js';
import { createAuthHeader, seedUser } from './helpers/auth.js';
import { createTestApp } from './helpers/test-app.js';
import { createTestDatabase } from './helpers/test-database.js';
describe('User management RBAC and ABAC', () => {
    let database;
    beforeEach(async () => {
        database = await createTestDatabase();
    });
    afterEach(async () => {
        await database.sequelize.close();
    });
    it('lets super admins create users with roles', async () => {
        const app = createTestApp({ databaseContext: database });
        const superAdmin = await seedUser(database, {
            role: 'super_admin',
            email: 'super@example.com'
        });
        const response = await request(app)
            .post('/api/v1/users')
            .set('Authorization', createAuthHeader({ id: superAdmin.id, email: superAdmin.email, role: superAdmin.role }))
            .send({
            name: 'Product Manager',
            email: 'manager@example.com',
            password: 'password123',
            role: 'manager'
        })
            .expect(201);
        const body = asSuccessBody(response.body);
        expect(body.data).toMatchObject({
            email: 'manager@example.com',
            role: 'manager'
        });
        await expect(database.models.User.findOne({ where: { email: 'manager@example.com' } })).resolves.toBeTruthy();
    });
    it('blocks admins from creating users or assigning roles', async () => {
        const app = createTestApp({ databaseContext: database });
        const admin = await seedUser(database, {
            role: 'admin',
            email: 'admin@example.com'
        });
        const response = await request(app)
            .post('/api/v1/users')
            .set('Authorization', createAuthHeader({ id: admin.id, email: admin.email, role: admin.role }))
            .send({
            name: 'Viewer',
            email: 'viewer@example.com',
            password: 'password123',
            role: 'viewer'
        })
            .expect(403);
        expect(asErrorBody(response.body).message).toBe('Forbidden');
    });
    it('lets admins list and view users but not update them', async () => {
        const app = createTestApp({ databaseContext: database });
        const admin = await seedUser(database, {
            role: 'admin',
            email: 'admin@example.com'
        });
        const viewer = await seedUser(database, {
            role: 'viewer',
            email: 'viewer@example.com'
        });
        const authHeader = createAuthHeader({ id: admin.id, email: admin.email, role: admin.role });
        await request(app).get('/api/v1/users').set('Authorization', authHeader).expect(200);
        await request(app).get(`/api/v1/users/${viewer.id}`).set('Authorization', authHeader).expect(200);
        const response = await request(app)
            .patch(`/api/v1/users/${viewer.id}`)
            .set('Authorization', authHeader)
            .send({ name: 'Changed Name' })
            .expect(403);
        expect(asErrorBody(response.body).message).toBe('Forbidden');
    });
    it('lets users view themselves through /users/:id but not another user', async () => {
        const app = createTestApp({ databaseContext: database });
        const viewer = await seedUser(database, {
            role: 'viewer',
            email: 'viewer@example.com'
        });
        const otherViewer = await seedUser(database, {
            role: 'viewer',
            email: 'other@example.com'
        });
        const authHeader = createAuthHeader({ id: viewer.id, email: viewer.email, role: viewer.role });
        await request(app).get(`/api/v1/users/${viewer.id}`).set('Authorization', authHeader).expect(200);
        const response = await request(app).get(`/api/v1/users/${otherViewer.id}`).set('Authorization', authHeader).expect(403);
        expect(asErrorBody(response.body).message).toBe('Forbidden');
    });
    it('prevents self-disable even for super admins', async () => {
        const app = createTestApp({ databaseContext: database });
        const superAdmin = await seedUser(database, {
            role: 'super_admin',
            email: 'super@example.com'
        });
        const response = await request(app)
            .patch(`/api/v1/users/${superAdmin.id}/disable`)
            .set('Authorization', createAuthHeader({ id: superAdmin.id, email: superAdmin.email, role: superAdmin.role }))
            .expect(403);
        expect(asErrorBody(response.body).message).toBe('Cannot disable your own user');
    });
});
