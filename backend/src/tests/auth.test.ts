import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { DatabaseContext } from '@/infra/database/database-context.js';
import { asErrorBody, asSuccessBody } from './helpers/http-assertions.js';
import { createAuthHeader, seedAuthHeader, seedUser } from './helpers/auth.js';
import { createTestApp } from './helpers/test-app.js';
import { createTestDatabase } from './helpers/test-database.js';

type LoginResponse = {
  token: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

describe('POST /api/v1/auth/login', () => {
  let database: DatabaseContext;

  beforeEach(async () => {
    database = await createTestDatabase();
  });

  afterEach(async () => {
    await database.sequelize.close();
  });

  it('issues a JWT for an active persisted user', async () => {
    const app = createTestApp({ databaseContext: database });
    const user = await seedUser(database, {
      name: 'Super Admin',
      email: 'super@example.com',
      password: 'strong-password',
      role: 'super_admin'
    });

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'super@example.com',
        password: 'strong-password'
      })
      .expect(200);
    const body = asSuccessBody<LoginResponse>(response.body);

    expect(body.data.token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
    expect(body.data).toMatchObject({
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        id: user.id,
        name: 'Super Admin',
        email: 'super@example.com',
        role: 'super_admin'
      }
    });
  });

  it('rejects invalid credentials and inactive users', async () => {
    const app = createTestApp({ databaseContext: database });
    await seedUser(database, {
      email: 'disabled@example.com',
      password: 'password123',
      isActive: false
    });

    await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'missing@example.com',
        password: 'password123'
      })
      .expect(401);

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'disabled@example.com',
        password: 'password123'
      })
      .expect(401);

    expect(asErrorBody(response.body).message).toBe('Invalid email or password');
  });
});

describe('Product route authorization', () => {
  let database: DatabaseContext;

  beforeEach(async () => {
    database = await createTestDatabase();
  });

  afterEach(async () => {
    await database.sequelize.close();
  });

  it('requires authentication for product writes', async () => {
    const app = createTestApp({ databaseContext: database });

    const response = await request(app)
      .post('/api/v1/products')
      .send({
        name: 'Wireless Mouse',
        description: 'Ergonomic mouse with USB-C charging',
        price: 59.99,
        stockQuantity: 25
      })
      .expect(401);

    expect(asErrorBody(response.body).message).toBe('Authentication required');
  });

  it('allows managers to create products but blocks viewers', async () => {
    const app = createTestApp({ databaseContext: database });

    await request(app)
      .post('/api/v1/products')
      .set('Authorization', await seedAuthHeader(database, 'manager'))
      .send({
        name: 'Wireless Mouse',
        description: 'Ergonomic mouse with USB-C charging',
        price: 59.99,
        stockQuantity: 25
      })
      .expect(201);

    const response = await request(app)
      .post('/api/v1/products')
      .set('Authorization', await seedAuthHeader(database, 'viewer'))
      .send({
        name: 'USB-C Hub',
        description: 'Seven-port hub for laptops',
        price: 49.5,
        stockQuantity: 30
      })
      .expect(403);

    expect(asErrorBody(response.body).message).toBe('Forbidden');
  });

  it('allows admins to delete products but blocks managers', async () => {
    const app = createTestApp({ databaseContext: database });
    const product = await database.models.Product.create({
      name: 'Wireless Mouse',
      description: 'Ergonomic mouse with USB-C charging',
      price: 59.99,
      stockQuantity: 25
    });

    await request(app)
      .delete(`/api/v1/products/${product.id}`)
      .set('Authorization', await seedAuthHeader(database, 'manager'))
      .expect(403);

    await request(app)
      .delete(`/api/v1/products/${product.id}`)
      .set('Authorization', await seedAuthHeader(database, 'admin'))
      .expect(200);
  });

  it('rejects tokens for users that are no longer active', async () => {
    const app = createTestApp({ databaseContext: database });
    const user = await seedUser(database, {
      role: 'admin',
      isActive: false
    });

    const response = await request(app)
      .delete('/api/v1/products/8d1f3f25-7f9b-4c0f-a3a5-5e3f8f3c9a10')
      .set('Authorization', createAuthHeader({ id: user.id, email: user.email, role: user.role }))
      .expect(401);

    expect(asErrorBody(response.body).message).toBe('Authentication required');
  });
});
