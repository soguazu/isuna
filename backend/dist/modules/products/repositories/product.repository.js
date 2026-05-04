import { Op } from 'sequelize';
export class SequelizeProductRepository {
    productModel;
    constructor(productModel) {
        this.productModel = productModel;
    }
    async create(data) {
        const product = await this.productModel.create(data);
        return this.toProduct(product);
    }
    async findById(id) {
        const product = await this.productModel.findByPk(id);
        return product ? this.toProduct(product) : null;
    }
    async list(options) {
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
    async updateById(id, data) {
        const product = await this.productModel.findByPk(id);
        if (!product) {
            return null;
        }
        await product.update(data);
        return this.toProduct(product);
    }
    async deleteById(id) {
        const product = await this.productModel.findByPk(id);
        if (!product) {
            return null;
        }
        await product.destroy();
        return {
            id
        };
    }
    toListWhere(search) {
        if (!search) {
            return {};
        }
        const searchPattern = `%${search}%`;
        return {
            [Op.or]: [{ name: { [Op.like]: searchPattern } }, { description: { [Op.like]: searchPattern } }]
        };
    }
    toProduct(product) {
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
