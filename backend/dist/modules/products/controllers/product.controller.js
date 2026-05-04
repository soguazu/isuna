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
    list = async (request, response) => {
        const result = await this.productService.listProducts(request.query);
        response.status(200).json({
            success: true,
            data: result.products,
            meta: result.meta
        });
    };
    retrieve = async (request, response) => {
        const product = await this.productService.retrieveProduct(request.params.id);
        response.status(200).json({
            success: true,
            data: product
        });
    };
    update = async (request, response) => {
        const product = await this.productService.updateProduct(request.params.id, request.body);
        response.status(200).json({
            success: true,
            data: product
        });
    };
    delete = async (request, response) => {
        const result = await this.productService.deleteProduct(request.params.id);
        response.status(200).json({
            success: true,
            data: result
        });
    };
}
