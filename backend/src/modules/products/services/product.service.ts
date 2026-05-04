import { ApiError } from '@/common/errors/api-error.js';
import type { Cache } from '@/infra/cache/cache.types.js';
import type { CreateProductBodyDto } from '@/modules/products/dtos/create-product.dto.js';
import type { ListProductsQueryDto } from '@/modules/products/dtos/list-products.dto.js';
import type { UpdateProductBodyDto } from '@/modules/products/dtos/update-product.dto.js';
import type { Product } from '@/modules/products/repositories/product.repository.types.js';
import type {
  DeleteProductResult,
  ListProductsResult,
  ProductRepository
} from '@/modules/products/repositories/product.repository.types.js';

const CACHE_TTL_MS = 30_000;

export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly cache: Cache
  ) {}

  async createProduct(input: CreateProductBodyDto): Promise<Product> {
    const product = await this.productRepository.create(input);
    await this.cache.flush();
    return product;
  }

  async listProducts(query: ListProductsQueryDto): Promise<ListProductsResult> {
    const key = `products:list:${JSON.stringify(query)}`;
    return this.cached(key, () => this.productRepository.list(query));
  }

  async retrieveProduct(id: string): Promise<Product> {
    const product = await this.cached(`products:retrieve:${id}`, () =>
      this.productRepository.findById(id)
    );

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

    await this.cache.flush();
    return product;
  }

  async deleteProduct(id: string): Promise<DeleteProductResult> {
    const result = await this.productRepository.deleteById(id);

    if (!result) {
      throw new ApiError('Product not found', 404);
    }

    await this.cache.flush();
    return result;
  }

  private async cached<T>(key: string, loader: () => Promise<T>): Promise<T> {
    const raw = await this.cache.get(key);
    if (raw !== null) return JSON.parse(raw) as T;

    const value = await loader();
    await this.cache.set(key, JSON.stringify(value), CACHE_TTL_MS);
    return value;
  }
}
