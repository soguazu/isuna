import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { asErrorBody, asSuccessBody } from './helpers/http-assertions.js';
import { createTestDatabase } from './helpers/test-database.js';
import { createTestApp } from './helpers/test-app.js';
describe('POST /api/v1/products', () => {
    let database;
    beforeEach(async () => {
        database = await createTestDatabase();
    });
    afterEach(async () => {
        await database.sequelize.close();
    });
    it('creates a product with a valid payload', async () => {
        const app = createTestApp({ databaseContext: database });
        const response = await request(app)
            .post('/api/v1/products')
            .send({
            name: 'Wireless Mouse',
            description: 'Ergonomic mouse with USB-C charging',
            price: 59.99,
            stockQuantity: 25
        })
            .expect(201);
        const body = asSuccessBody(response.body);
        expect(body.data).toMatchObject({
            name: 'Wireless Mouse',
            description: 'Ergonomic mouse with USB-C charging',
            price: 59.99,
            stockQuantity: 25,
            deletedAt: null
        });
        expect(body.data.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        expect(new Date(body.data.createdAt).toString()).not.toBe('Invalid Date');
        expect(new Date(body.data.updatedAt).toString()).not.toBe('Invalid Date');
        const persistedProduct = await database.models.Product.findByPk(body.data.id);
        expect(persistedProduct?.name).toBe('Wireless Mouse');
    });
    it('rejects invalid product payloads with a consistent validation response', async () => {
        const app = createTestApp({ databaseContext: database });
        const response = await request(app)
            .post('/api/v1/products')
            .send({
            name: '',
            description: '',
            price: -1,
            stockQuantity: 1.5
        })
            .expect(422);
        const body = asErrorBody(response.body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Validation failed');
        expect(body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ path: 'name' }),
            expect.objectContaining({ path: 'description' }),
            expect.objectContaining({ path: 'price' }),
            expect.objectContaining({ path: 'stockQuantity' })
        ]));
    });
});
describe('GET /api/v1/docs', () => {
    it('serves Swagger documentation for the versioned API', async () => {
        const app = createTestApp();
        const response = await request(app).get('/api/v1/docs/').expect(200);
        expect(response.text).toContain('Swagger UI');
    });
});
