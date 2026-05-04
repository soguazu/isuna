export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type CreateProductData = {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
};

export type UpdateProductData = Partial<CreateProductData>;

export type ListProductsOptions = {
  page: number;
  pageSize: number;
  search?: string;
};

export type ProductListMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type ListProductsResult = {
  products: Product[];
  meta: ProductListMeta;
};

export type DeleteProductResult = {
  id: string;
};

export type ProductRepository = {
  create(data: CreateProductData): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  list(options: ListProductsOptions): Promise<ListProductsResult>;
  updateById(id: string, data: UpdateProductData): Promise<Product | null>;
  deleteById(id: string): Promise<DeleteProductResult | null>;
};
