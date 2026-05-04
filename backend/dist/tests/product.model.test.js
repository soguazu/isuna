import { randomUUID } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SequelizeProductRepository } from '../modules/products/repositories/product.repository.js';
import { createTestDatabase } from './helpers/test-database.js';
describe('Product persistence', () => {
    let database;
    let productRepository;
    beforeEach(async () => {
        database = await createTestDatabase();
        productRepository = new SequelizeProductRepository(database.models.Product);
    });
    afterEach(async () => {
        await database.sequelize.close();
    });
    it('creates products with UUID identifiers and timestamps', async () => {
        const product = await productRepository.create({
            name: 'Mechanical Keyboard',
            description: 'Compact keyboard with tactile switches',
            price: 129.99,
            stockQuantity: 15
        });
        expect(product.id).toEqual(expect.any(String));
        expect(product.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        expect(product.createdAt).toBeInstanceOf(Date);
        expect(product.updatedAt).toBeInstanceOf(Date);
        expect(product.deletedAt).toBeNull();
    });
    it('retrieves a product by id through the repository boundary', async () => {
        const createdProduct = await productRepository.create({
            name: 'USB-C Hub',
            description: 'Seven-port hub for laptops',
            price: 49.5,
            stockQuantity: 30
        });
        const product = await productRepository.findById(createdProduct.id);
        expect(product).toMatchObject({
            id: createdProduct.id,
            name: 'USB-C Hub',
            description: 'Seven-port hub for laptops',
            price: 49.5,
            stockQuantity: 30,
            deletedAt: null
        });
    });
    it('returns null when a product id does not exist', async () => {
        await expect(productRepository.findById(randomUUID())).resolves.toBeNull();
    });
    it('excludes soft-deleted products from normal lookups', async () => {
        const createdProduct = await productRepository.create({
            name: 'Laptop Stand',
            description: 'Adjustable aluminum stand',
            price: 39.99,
            stockQuantity: 20
        });
        await database.models.Product.destroy({
            where: {
                id: createdProduct.id
            }
        });
        await expect(productRepository.findById(createdProduct.id)).resolves.toBeNull();
    });
});
