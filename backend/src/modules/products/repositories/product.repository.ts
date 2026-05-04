import { Op } from 'sequelize';
import type { WhereOptions } from 'sequelize';
import type { Product } from '@/modules/products/entities/product.entity.js';
import type { ProductModel } from '@/modules/products/models/product.model.js';
import type {
  CreateProductData,
  DeleteProductResult,
  ListProductsOptions,
  ListProductsResult,
  ProductRepository,
  UpdateProductData
} from '@/modules/products/repositories/product.repository.types.js';

type ProductModelStatic = typeof ProductModel;

export class SequelizeProductRepository implements ProductRepository {
  constructor(private readonly productModel: ProductModelStatic) {}

  async create(data: CreateProductData): Promise<Product> {
    const product = await this.productModel.create(data);

    return this.toProduct(product);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.productModel.findByPk(id);

    return product ? this.toProduct(product) : null;
  }

  async list(options: ListProductsOptions): Promise<ListProductsResult> {
    const where = this.toListWhere(options.search);
    const { count, rows } = await this.productModel.findAndCountAll({
      where,
      limit: options.pageSize,
      offset: (options.page - 1) * options.pageSize,
      order: [
        ['createdAt', 'DESC'],
        ['id', 'DESC']
      ]
    });

    return {
      products: rows.map((product) => this.toProduct(product)),
      meta: {
        page: options.page,
        pageSize: options.pageSize,
        totalItems: count,
        totalPages: Math.ceil(count / options.pageSize)
      }
    };
  }

  async updateById(id: string, data: UpdateProductData): Promise<Product | null> {
    const product = await this.productModel.findByPk(id);

    if (!product) {
      return null;
    }

    await product.update(data);

    return this.toProduct(product);
  }

  async deleteById(id: string): Promise<DeleteProductResult | null> {
    const product = await this.productModel.findByPk(id);

    if (!product) {
      return null;
    }

    await product.destroy();

    return {
      id
    };
  }

  private toListWhere(search: string | undefined): WhereOptions {
    if (!search) {
      return {};
    }

    const searchPattern = `%${search}%`;

    return {
      [Op.or]: [{ name: { [Op.like]: searchPattern } }, { description: { [Op.like]: searchPattern } }]
    };
  }

  private toProduct(product: ProductModel): Product {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stockQuantity: product.stockQuantity,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      deletedAt: product.deletedAt ?? null
    };
  }
}
