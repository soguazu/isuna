import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { asErrorBody, asSuccessBody } from './helpers/http-assertions.js';
import { createTestApp } from './helpers/test-app.js';
import { createTestDatabase } from './helpers/test-database.js';
describe('GET /api/v1/products', () => {
    let database;
    beforeEach(async () => {
        database = await createTestDatabase();
    });
    afterEach(async () => {
        await database.sequelize.close();
    });
    it('lists products with default pagination metadata', async () => {
        const app = createTestApp({ databaseContext: database });
        await seedProducts([
            ['Wireless Mouse', 'Ergonomic mouse with USB-C charging', 59.99, 25],
            ['Mechanical Keyboard', 'Compact keyboard with tactile switches', 129.99, 15],
            ['USB-C Hub', 'Seven-port hub for laptops', 49.5, 30]
        ]);
        const response = await request(app).get('/api/v1/products').expect(200);
        const body = asSuccessBody(response.body);
        expect(body.success).toBe(true);
        expect(body.data).toHaveLength(3);
        expect(body.meta).toEqual({
            page: 1,
            pageSize: 10,
            totalItems: 3,
            totalPages: 1
        });
        expect(body.data.map((product) => product.name)).toEqual(expect.arrayContaining(['Wireless Mouse', 'Mechanical Keyboard', 'USB-C Hub']));
    });
    it('paginates products with explicit page and page size', async () => {
        const app = createTestApp({ databaseContext: database });
        await seedProducts([
            ['Alpha Monitor', '27-inch display', 199.99, 10],
            ['Beta Monitor', '24-inch display', 149.99, 12],
            ['Gamma Monitor', '32-inch display', 299.99, 8]
        ]);
        const response = await request(app).get('/api/v1/products?page=2&pageSize=2').expect(200);
        const body = asSuccessBody(response.body);
        expect(body.data).toHaveLength(1);
        expect(body.meta).toEqual({
            page: 2,
            pageSize: 2,
            totalItems: 3,
            totalPages: 2
        });
    });
    it('searches products by name and description', async () => {
        const app = createTestApp({ databaseContext: database });
        await seedProducts([
            ['Wireless Mouse', 'Ergonomic mouse with USB-C charging', 59.99, 25],
            ['Laptop Stand', 'Adjustable aluminum riser', 39.99, 20],
            ['Desk Lamp', 'LED lamp with USB-C power passthrough', 34.99, 18]
        ]);
        const response = await request(app).get('/api/v1/products?search=usb-c').expect(200);
        const body = asSuccessBody(response.body);
        expect(body.data.map((product) => product.name)).toEqual(expect.arrayContaining(['Wireless Mouse', 'Desk Lamp']));
        expect(body.data).toHaveLength(2);
        expect(body.meta).toMatchObject({
            page: 1,
            pageSize: 10,
            totalItems: 2,
            totalPages: 1
        });
    });
    it('excludes soft-deleted products from list results', async () => {
        const app = createTestApp({ databaseContext: database });
        const [activeProduct, deletedProduct] = await seedProducts([
            ['Active Product', 'Still available', 10, 5],
            ['Deleted Product', 'No longer available', 20, 3]
        ]);
        await database.models.Product.destroy({
            where: {
                id: deletedProduct.id
            }
        });
        const response = await request(app).get('/api/v1/products').expect(200);
        const body = asSuccessBody(response.body);
        expect(body.data).toHaveLength(1);
        expect(body.data[0]).toMatchObject({
            id: activeProduct.id,
            name: 'Active Product'
        });
        expect(body.meta.totalItems).toBe(1);
    });
    it('rejects invalid pagination query parameters', async () => {
        const app = createTestApp({ databaseContext: database });
        const response = await request(app).get('/api/v1/products?page=0&pageSize=101').expect(422);
        const body = asErrorBody(response.body);
        expect(body.success).toBe(false);
        expect(body.message).toBe('Validation failed');
        expect(body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ path: 'page' }),
            expect.objectContaining({ path: 'pageSize' })
        ]));
    });
    const seedProducts = async (products) => database.models.Product.bulkCreate(products.map(([name, description, price, stockQuantity]) => ({
        name,
        description,
        price,
        stockQuantity
    })));
});
