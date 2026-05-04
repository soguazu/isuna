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
