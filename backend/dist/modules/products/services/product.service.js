import { ApiError } from '../../../common/errors/api-error.js';
export class ProductService {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async createProduct(input) {
        return this.productRepository.create(input);
    }
    async listProducts(query) {
        return this.productRepository.list(query);
    }
    async retrieveProduct(id) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new ApiError('Product not found', 404);
        }
        return product;
    }
    async updateProduct(id, input) {
        const product = await this.productRepository.updateById(id, input);
        if (!product) {
            throw new ApiError('Product not found', 404);
        }
        return product;
    }
    async deleteProduct(id) {
        const result = await this.productRepository.deleteById(id);
        if (!result) {
            throw new ApiError('Product not found', 404);
        }
        return result;
    }
}
