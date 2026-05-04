export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ProductListMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
};

export type UpdateProductInput = Partial<CreateProductInput>;
