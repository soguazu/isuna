import { ApiError } from '../../../common/errors/api-error.js';
const CACHE_TTL_MS = 30_000;
export class ProductService {
    productRepository;
    cache;
    constructor(productRepository, cache) {
        this.productRepository = productRepository;
        this.cache = cache;
    }
    async createProduct(input) {
        const product = await this.productRepository.create(input);
        await this.cache.flush();
        return product;
    }
    async listProducts(query) {
        const key = `products:list:${JSON.stringify(query)}`;
        return this.cached(key, () => this.productRepository.list(query));
    }
    async retrieveProduct(id) {
        const product = await this.cached(`products:retrieve:${id}`, () => this.productRepository.findById(id));
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
        await this.cache.flush();
        return product;
    }
    async deleteProduct(id) {
        const result = await this.productRepository.deleteById(id);
        if (!result) {
            throw new ApiError('Product not found', 404);
        }
        await this.cache.flush();
        return result;
    }
    async cached(key, loader) {
        const raw = await this.cache.get(key);
        if (raw !== null)
            return JSON.parse(raw);
        const value = await loader();
        await this.cache.set(key, JSON.stringify(value), CACHE_TTL_MS);
        return value;
    }
}
