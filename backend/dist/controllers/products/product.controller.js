export class ProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    create = async (request, response) => {
        const product = await this.productService.createProduct(request.body);
        response.status(201).json({
            success: true,
            data: product
        });
    };
}
