import { ApiError } from '../../../common/errors/api-error.js';
export class ProductService {
    productRepository;
    cache = new Map();
    cacheTtlMs = 30_000;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async createProduct(input) {
        const product = await this.productRepository.create(input);
        this.clearCache();
        return product;
    }
    async listProducts(query) {
        return this.getOrSetCache(`products:list:${JSON.stringify(query)}`, () => this.productRepository.list(query));
    }
    async retrieveProduct(id) {
        const product = await this.getOrSetCache(`products:retrieve:${id}`, () => this.productRepository.findById(id));
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
        this.clearCache();
        return product;
    }
    async deleteProduct(id) {
        const result = await this.productRepository.deleteById(id);
        if (!result) {
            throw new ApiError('Product not found', 404);
        }
        this.clearCache();
        return result;
    }
    async getOrSetCache(key, loader) {
        const cachedValue = this.cache.get(key);
        if (cachedValue && cachedValue.expiresAt > Date.now()) {
            return cachedValue.value;
        }
        const value = await loader();
        this.cache.set(key, {
            expiresAt: Date.now() + this.cacheTtlMs,
            value
        });
        return value;
    }
    clearCache() {
        this.cache.clear();
    }
}
