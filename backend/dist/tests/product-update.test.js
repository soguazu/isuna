import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { asErrorBody, asSuccessBody } from './helpers/http-assertions.js';
import { createTestApp } from './helpers/test-app.js';
import { createTestDatabase } from './helpers/test-database.js';
describe('PATCH /api/v1/products/:id', () => {
    let database;
    beforeEach(async () => {
        database = await createTestDatabase();
    });
    afterEach(async () => {
        await database.sequelize.close();
    });
    it('partially updates a product', async () => {
        const app = createTestApp({ databaseContext: database });
        const product = await seedProduct();
        const response = await request(app)
            .patch(`/api/v1/products/${product.id}`)
            .send({
            price: 69.99
        })
            .expect(200);
        const body = asSuccessBody(response.body);
        expect(body.data).toMatchObject({
            id: product.id,
            name: 'Wireless Mouse',
            description: 'Ergonomic mouse with USB-C charging',
            price: 69.99,
            stockQuantity: 25
        });
        const persistedProduct = await database.models.Product.findByPk(product.id);
        expect(Number(persistedProduct?.price)).toBe(69.99);
    });
    it('updates all mutable product fields', async () => {
        const app = createTestApp({ databaseContext: database });
        const product = await seedProduct();
        const response = await request(app)
            .patch(`/api/v1/products/${product.id}`)
            .send({
            name: 'Trackball Mouse',
            description: 'Ergonomic trackball with Bluetooth',
            price: 89.5,
            stockQuantity: 12
        })
            .expect(200);
        const body = asSuccessBody(response.body);
        expect(body.data).toMatchObject({
            id: product.id,
            name: 'Trackball Mouse',
            description: 'Ergonomic trackball with Bluetooth',
            price: 89.5,
            stockQuantity: 12
        });
    });
    it('returns 404 when updating a missing product', async () => {
        const app = createTestApp({ databaseContext: database });
        const response = await request(app)
            .patch(`/api/v1/products/${randomUUID()}`)
            .send({
            name: 'Missing Product'
        })
            .expect(404);
        const body = asErrorBody(response.body);
        expect(body).toEqual({
            success: false,
            message: 'Product not found'
        });
    });
    it('returns 404 when updating a soft-deleted product', async () => {
        const app = createTestApp({ databaseContext: database });
        const product = await seedProduct();
        await product.destroy();
        const response = await request(app)
            .patch(`/api/v1/products/${product.id}`)
            .send({
            name: 'Deleted Product'
        })
            .expect(404);
        const body = asErrorBody(response.body);
        expect(body.message).toBe('Product not found');
    });
    it('rejects invalid update payloads', async () => {
        const app = createTestApp({ databaseContext: database });
        const product = await seedProduct();
        const response = await request(app)
            .patch(`/api/v1/products/${product.id}`)
            .send({
            name: '',
            price: -1,
            stockQuantity: 1.5
        })
            .expect(422);
        const body = asErrorBody(response.body);
        expect(body.message).toBe('Validation failed');
        expect(body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ path: 'name' }),
            expect.objectContaining({ path: 'price' }),
            expect.objectContaining({ path: 'stockQuantity' })
        ]));
    });
    it('rejects empty update payloads and invalid UUID params', async () => {
        const app = createTestApp({ databaseContext: database });
        const emptyBodyResponse = await request(app).patch(`/api/v1/products/${randomUUID()}`).send({}).expect(422);
        const invalidUuidResponse = await request(app)
            .patch('/api/v1/products/not-a-uuid')
            .send({
            name: 'Valid Name'
        })
            .expect(422);
        expect(asErrorBody(emptyBodyResponse.body).errors).toEqual([expect.objectContaining({ path: 'body' })]);
        expect(asErrorBody(invalidUuidResponse.body).errors).toEqual([expect.objectContaining({ path: 'id' })]);
    });
    const seedProduct = async () => database.models.Product.create({
        name: 'Wireless Mouse',
        description: 'Ergonomic mouse with USB-C charging',
        price: 59.99,
        stockQuantity: 25
    });
});
