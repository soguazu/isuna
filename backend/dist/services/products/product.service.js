export class ProductService {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async createProduct(input) {
        return this.productRepository.create(input);
    }
}
