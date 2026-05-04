import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { DatabaseContext } from '@/infra/database/database-context.js';
import type { Product } from '@/modules/products/entities/product.entity.js';
import { asErrorBody, asSuccessBody } from './helpers/http-assertions.js';
import { createTestApp } from './helpers/test-app.js';
import { createTestDatabase } from './helpers/test-database.js';

describe('GET /api/v1/products/:id', () => {
  let database: DatabaseContext;

  beforeEach(async () => {
    database = await createTestDatabase();
  });

  afterEach(async () => {
    await database.sequelize.close();
  });

  it('retrieves a product by UUID', async () => {
    const app = createTestApp({ databaseContext: database });
    const product = await database.models.Product.create({
      name: 'Wireless Mouse',
      description: 'Ergonomic mouse with USB-C charging',
      price: 59.99,
      stockQuantity: 25
    });

    const response = await request(app).get(`/api/v1/products/${product.id}`).expect(200);
    const body = asSuccessBody<Product>(response.body);

    expect(body.data).toMatchObject({
      id: product.id,
      name: 'Wireless Mouse',
      description: 'Ergonomic mouse with USB-C charging',
      price: 59.99,
      stockQuantity: 25,
      deletedAt: null
    });
  });

  it('returns 404 when the product does not exist', async () => {
    const app = createTestApp({ databaseContext: database });

    const response = await request(app).get(`/api/v1/products/${randomUUID()}`).expect(404);
    const body = asErrorBody(response.body);

    expect(body).toEqual({
      success: false,
      message: 'Product not found'
    });
  });

  it('returns 404 for soft-deleted products', async () => {
    const app = createTestApp({ databaseContext: database });
    const product = await database.models.Product.create({
      name: 'Deleted Product',
      description: 'No longer available',
      price: 20,
      stockQuantity: 3
    });

    await product.destroy();

    const response = await request(app).get(`/api/v1/products/${product.id}`).expect(404);
    const body = asErrorBody(response.body);

    expect(body.message).toBe('Product not found');
  });

  it('rejects invalid UUID params', async () => {
    const app = createTestApp({ databaseContext: database });

    const response = await request(app).get('/api/v1/products/not-a-uuid').expect(422);
    const body = asErrorBody(response.body);

    expect(body.success).toBe(false);
    expect(body.message).toBe('Validation failed');
    expect(body.errors).toEqual([expect.objectContaining({ path: 'id' })]);
  });
});
