import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { DatabaseContext } from '@/infra/database/database-context.js';
import { asErrorBody, asSuccessBody } from './helpers/http-assertions.js';
import { createAuthHeader, seedUser } from './helpers/auth.js';
import { createTestApp } from './helpers/test-app.js';
import { createTestDatabase } from './helpers/test-database.js';

describe('User profile ABAC', () => {
  let database: DatabaseContext;

  beforeEach(async () => {
    database = await createTestDatabase();
  });

  afterEach(async () => {
    await database.sequelize.close();
  });

  it('lets an authenticated user view their own profile', async () => {
    const app = createTestApp({ databaseContext: database });
    const user = await seedUser(database, {
      name: 'Viewer User',
      email: 'viewer@example.com',
      role: 'viewer'
    });

    const response = await request(app)
      .get('/api/v1/me')
      .set('Authorization', createAuthHeader({ id: user.id, email: user.email, role: user.role }))
      .expect(200);
    const body = asSuccessBody<{ id: string; name: string; email: string; role: string }>(response.body);

    expect(body.data).toMatchObject({
      id: user.id,
      name: 'Viewer User',
      email: 'viewer@example.com',
      role: 'viewer'
    });
    expect(JSON.stringify(body.data)).not.toContain('passwordHash');
  });

  it('lets an authenticated user update safe profile fields only', async () => {
    const app = createTestApp({ databaseContext: database });
    const user = await seedUser(database, {
      name: 'Viewer User',
      email: 'viewer@example.com',
      role: 'viewer'
    });

    const response = await request(app)
      .patch('/api/v1/me')
      .set('Authorization', createAuthHeader({ id: user.id, email: user.email, role: user.role }))
      .send({
        name: 'Updated Viewer',
        email: 'updated-viewer@example.com',
        role: 'super_admin',
        isActive: false
      })
      .expect(200);
    const body = asSuccessBody<{ name: string; email: string; role: string; isActive: boolean }>(response.body);

    expect(body.data).toMatchObject({
      name: 'Updated Viewer',
      email: 'updated-viewer@example.com',
      role: 'viewer',
      isActive: true
    });
  });

  it('requires authentication for profile access', async () => {
    const app = createTestApp({ databaseContext: database });

    const response = await request(app).get('/api/v1/me').expect(401);

    expect(asErrorBody(response.body).message).toBe('Authentication required');
  });
});
