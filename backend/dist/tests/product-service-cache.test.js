import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProductService } from '../modules/products/services/product.service.js';
const createProduct = (overrides = {}) => ({
    id: randomUUID(),
    name: 'Wireless Mouse',
    description: 'Ergonomic mouse with USB-C charging',
    price: 59.99,
    stockQuantity: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides
});
describe('ProductService cache', () => {
    let repository;
    let service;
    let listCalls;
    beforeEach(() => {
        listCalls = 0;
        repository = {
            create: (data) => Promise.resolve(createProduct(data)),
            findById: (id) => Promise.resolve(createProduct({ id })),
            list: (options) => {
                listCalls += 1;
                return Promise.resolve({
                    products: [createProduct()],
                    meta: {
                        page: options.page,
                        pageSize: options.pageSize,
                        totalItems: 1,
                        totalPages: 1
                    }
                });
            },
            updateById: (id, data) => Promise.resolve(createProduct({ id, ...data })),
            deleteById: (id) => Promise.resolve({ id })
        };
        service = new ProductService(repository);
    });
    it('caches repeated list reads for the same query', async () => {
        await service.listProducts({ page: 1, pageSize: 10 });
        await service.listProducts({ page: 1, pageSize: 10 });
        expect(listCalls).toBe(1);
    });
    it('clears cached reads after product writes', async () => {
        await service.listProducts({ page: 1, pageSize: 10 });
        await service.createProduct({
            name: 'USB-C Hub',
            description: 'Seven-port hub for laptops',
            price: 49.5,
            stockQuantity: 30
        });
        await service.listProducts({ page: 1, pageSize: 10 });
        expect(listCalls).toBe(2);
    });
});
