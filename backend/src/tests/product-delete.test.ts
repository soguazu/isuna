import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { SuccessResponse } from '@/common/types/http.js';
import type { DatabaseContext } from '@/infra/database/database-context.js';
import { seedAuthHeader } from './helpers/auth.js';
import { asErrorBody, asSuccessBody } from './helpers/http-assertions.js';
import { createTestApp } from './helpers/test-app.js';
import { createTestDatabase } from './helpers/test-database.js';

type DeleteProductResponse = {
  id: string;
};

describe('DELETE /api/v1/products/:id', () => {
  let database: DatabaseContext;

  beforeEach(async () => {
    database = await createTestDatabase();
  });

  afterEach(async () => {
    await database.sequelize.close();
  });

  it('soft deletes a product by UUID', async () => {
    const app = createTestApp({ databaseContext: database });
    const product = await seedProduct();

    const response = await request(app)
      .delete(`/api/v1/products/${product.id}`)
      .set('Authorization', await seedAuthHeader(database, 'admin'))
      .expect(200);
    const body = asSuccessBody<DeleteProductResponse>(response.body);

    expect(body).toEqual({
      success: true,
      data: {
        id: product.id
      }
    } satisfies SuccessResponse<DeleteProductResponse>);

    await expect(database.models.Product.findByPk(product.id)).resolves.toBeNull();

    const deletedProduct = await database.models.Product.findByPk(product.id, {
      paranoid: false
    });
    expect(deletedProduct?.deletedAt).toBeInstanceOf(Date);
  });

  it('excludes deleted products from normal list and retrieve reads', async () => {
    const app = createTestApp({ databaseContext: database });
    const product = await seedProduct();

    await request(app).delete(`/api/v1/products/${product.id}`).set('Authorization', await seedAuthHeader(database, 'admin')).expect(200);

    const listResponse = await request(app).get('/api/v1/products').expect(200);
    const retrieveResponse = await request(app).get(`/api/v1/products/${product.id}`).expect(404);

    expect(asSuccessBody<unknown[]>(listResponse.body).data).toHaveLength(0);
    expect(asErrorBody(retrieveResponse.body).message).toBe('Product not found');
  });

  it('returns 404 when deleting a missing product', async () => {
    const app = createTestApp({ databaseContext: database });

    const response = await request(app)
      .delete(`/api/v1/products/${randomUUID()}`)
      .set('Authorization', await seedAuthHeader(database, 'admin'))
      .expect(404);
    const body = asErrorBody(response.body);

    expect(body).toEqual({
      success: false,
      message: 'Product not found'
    });
  });

  it('returns 404 when deleting an already soft-deleted product', async () => {
    const app = createTestApp({ databaseContext: database });
    const product = await seedProduct();

    await product.destroy();

    const response = await request(app)
      .delete(`/api/v1/products/${product.id}`)
      .set('Authorization', await seedAuthHeader(database, 'admin'))
      .expect(404);
    const body = asErrorBody(response.body);

    expect(body.message).toBe('Product not found');
  });

  it('rejects invalid UUID params', async () => {
    const app = createTestApp({ databaseContext: database });

    const response = await request(app)
      .delete('/api/v1/products/not-a-uuid')
      .set('Authorization', await seedAuthHeader(database, 'admin'))
      .expect(422);
    const body = asErrorBody(response.body);

    expect(body.success).toBe(false);
    expect(body.message).toBe('Validation failed');
    expect(body.errors).toEqual([expect.objectContaining({ path: 'id' })]);
  });

  const seedProduct = async () =>
    database.models.Product.create({
      name: 'Wireless Mouse',
      description: 'Ergonomic mouse with USB-C charging',
      price: 59.99,
      stockQuantity: 25
    });
});
