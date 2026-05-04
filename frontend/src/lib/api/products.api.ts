import type { ApiListResponse, ApiResponse } from '@/lib/types/api';
import type { CreateProductInput, Product, ProductListMeta, UpdateProductInput } from '@/lib/types/product';
import { apiClient } from './client';

export type ListProductsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export type ProductListApiResponse = ApiListResponse<Product[], ProductListMeta>;

export const productsApi = {
  list: async (params: ListProductsParams = {}): Promise<ProductListApiResponse> => {
    const { data } = await apiClient.get<ProductListApiResponse>('/products', { params });
    return data;
  },

  retrieve: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return data.data;
  },

  create: async (input: CreateProductInput): Promise<Product> => {
    const { data } = await apiClient.post<ApiResponse<Product>>('/products', input);
    return data.data;
  },

  update: async (id: string, input: UpdateProductInput): Promise<Product> => {
    const { data } = await apiClient.patch<ApiResponse<Product>>(`/products/${id}`, input);
    return data.data;
  },

  remove: async (id: string): Promise<{ id: string }> => {
    const { data } = await apiClient.delete<ApiResponse<{ id: string }>>(`/products/${id}`);
    return data.data;
  },
};
