import { ApiError } from '@/common/errors/api-error.js';
import type { CreateProductBodyDto } from '@/modules/products/dtos/create-product.dto.js';
import type { ListProductsQueryDto } from '@/modules/products/dtos/list-products.dto.js';
import type { UpdateProductBodyDto } from '@/modules/products/dtos/update-product.dto.js';
import type { Product } from '@/modules/products/repositories/product.repository.types.js';
import type {
  DeleteProductResult,
  ListProductsResult,
  ProductRepository
} from '@/modules/products/repositories/product.repository.types.js';

export class ProductService {
  private readonly cache = new Map<string, { expiresAt: number; value: unknown }>();
  private readonly cacheTtlMs = 30_000;

  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(input: CreateProductBodyDto): Promise<Product> {
    const product = await this.productRepository.create(input);

    this.clearCache();

    return product;
  }

  async listProducts(query: ListProductsQueryDto): Promise<ListProductsResult> {
    return this.getOrSetCache(`products:list:${JSON.stringify(query)}`, () => this.productRepository.list(query));
  }

  async retrieveProduct(id: string): Promise<Product> {
    const product = await this.getOrSetCache(`products:retrieve:${id}`, () => this.productRepository.findById(id));

    if (!product) {
      throw new ApiError('Product not found', 404);
    }

    return product;
  }

  async updateProduct(id: string, input: UpdateProductBodyDto): Promise<Product> {
    const product = await this.productRepository.updateById(id, input);

    if (!product) {
      throw new ApiError('Product not found', 404);
    }

    this.clearCache();

    return product;
  }

  async deleteProduct(id: string): Promise<DeleteProductResult> {
    const result = await this.productRepository.deleteById(id);

    if (!result) {
      throw new ApiError('Product not found', 404);
    }

    this.clearCache();

    return result;
  }

  private async getOrSetCache<TValue>(key: string, loader: () => Promise<TValue>): Promise<TValue> {
    const cachedValue = this.cache.get(key);

    if (cachedValue && cachedValue.expiresAt > Date.now()) {
      return cachedValue.value as TValue;
    }

    const value = await loader();

    this.cache.set(key, {
      expiresAt: Date.now() + this.cacheTtlMs,
      value
    });

    return value;
  }

  private clearCache(): void {
    this.cache.clear();
  }
}
