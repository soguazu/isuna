import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryCache } from '@/infra/cache/memory-cache.js';
import type { Product } from '@/modules/products/repositories/product.repository.types.js';
import type {
  CreateProductData,
  ListProductsOptions,
  ProductRepository,
  UpdateProductData
} from '@/modules/products/repositories/product.repository.types.js';
import { ProductService } from '@/modules/products/services/product.service.js';

const createProduct = (overrides: Partial<Product> = {}): Product => ({
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
  let repository: ProductRepository;
  let service: ProductService;
  let listCalls: number;

  beforeEach(() => {
    listCalls = 0;
    repository = {
      create: (data: CreateProductData) => Promise.resolve(createProduct(data)),
      findById: (id: string) => Promise.resolve(createProduct({ id })),
      list: (options: ListProductsOptions) => {
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
      updateById: (id: string, data: UpdateProductData) => Promise.resolve(createProduct({ id, ...data })),
      deleteById: (id: string) => Promise.resolve({ id })
    };
    service = new ProductService(repository, new MemoryCache());
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
