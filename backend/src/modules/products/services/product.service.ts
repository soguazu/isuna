import { ApiError } from '@/common/errors/api-error.js';
import type { CreateProductBodyDto } from '@/modules/products/dtos/create-product.dto.js';
import type { ListProductsQueryDto } from '@/modules/products/dtos/list-products.dto.js';
import type { UpdateProductBodyDto } from '@/modules/products/dtos/update-product.dto.js';
import type { Product } from '@/modules/products/entities/product.entity.js';
import type {
  DeleteProductResult,
  ListProductsResult,
  ProductRepository
} from '@/modules/products/repositories/product.repository.types.js';

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(input: CreateProductBodyDto): Promise<Product> {
    return this.productRepository.create(input);
  }

  async listProducts(query: ListProductsQueryDto): Promise<ListProductsResult> {
    return this.productRepository.list(query);
  }

  async retrieveProduct(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);

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

    return product;
  }

  async deleteProduct(id: string): Promise<DeleteProductResult> {
    const result = await this.productRepository.deleteById(id);

    if (!result) {
      throw new ApiError('Product not found', 404);
    }

    return result;
  }
}
