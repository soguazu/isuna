import type { Request, Response } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { SuccessResponse } from '@/common/types/http.js';
import type { CreateProductRequest } from '@/modules/products/dtos/create-product.dto.js';
import type { ListProductsQueryDto } from '@/modules/products/dtos/list-products.dto.js';
import type { RetrieveProductRequest } from '@/modules/products/dtos/retrieve-product.dto.js';
import type { UpdateProductRequest } from '@/modules/products/dtos/update-product.dto.js';
import type { Product } from '@/modules/products/entities/product.entity.js';
import type { DeleteProductResult, ProductListMeta } from '@/modules/products/repositories/product.repository.types.js';
import type { ProductService } from '@/modules/products/services/product.service.js';

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  create = async (request: CreateProductRequest, response: Response<SuccessResponse<Product>>): Promise<void> => {
    const product = await this.productService.createProduct(request.body);

    response.status(201).json({
      success: true,
      data: product
    });
  };

  list = async (
    request: Request<ParamsDictionary, SuccessResponse<Product[], ProductListMeta>, unknown, ListProductsQueryDto>,
    response: Response<SuccessResponse<Product[], ProductListMeta>>
  ): Promise<void> => {
    const result = await this.productService.listProducts(request.query);

    response.status(200).json({
      success: true,
      data: result.products,
      meta: result.meta
    });
  };

  retrieve = async (
    request: RetrieveProductRequest,
    response: Response<SuccessResponse<Product>>
  ): Promise<void> => {
    const product = await this.productService.retrieveProduct(request.params.id);

    response.status(200).json({
      success: true,
      data: product
    });
  };

  update = async (request: UpdateProductRequest, response: Response<SuccessResponse<Product>>): Promise<void> => {
    const product = await this.productService.updateProduct(request.params.id, request.body);

    response.status(200).json({
      success: true,
      data: product
    });
  };

  delete = async (
    request: RetrieveProductRequest,
    response: Response<SuccessResponse<DeleteProductResult>>
  ): Promise<void> => {
    const result = await this.productService.deleteProduct(request.params.id);

    response.status(200).json({
      success: true,
      data: result
    });
  };
}
