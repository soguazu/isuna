import type { ApiResponse } from '@/lib/types/api';
import type { AuthUser } from '@/lib/types/auth';
import type { CreateUserInput, UpdateUserInput, User } from '@/lib/types/user';
import { apiClient } from './client';

export const usersApi = {
  me: async (): Promise<AuthUser> => {
    const { data } = await apiClient.get<ApiResponse<AuthUser>>('/me');
    return data.data;
  },

  updateMe: async (input: UpdateUserInput): Promise<AuthUser> => {
    const { data } = await apiClient.patch<ApiResponse<AuthUser>>('/me', input);
    return data.data;
  },

  list: async (): Promise<User[]> => {
    const { data } = await apiClient.get<ApiResponse<User[]>>('/users');
    return data.data;
  },

  retrieve: async (id: string): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return data.data;
  },

  create: async (input: CreateUserInput): Promise<User> => {
    const { data } = await apiClient.post<ApiResponse<User>>('/users', input);
    return data.data;
  },

  update: async (id: string, input: UpdateUserInput): Promise<User> => {
    const { data } = await apiClient.patch<ApiResponse<User>>(`/users/${id}`, input);
    return data.data;
  },

  disable: async (id: string): Promise<User> => {
    const { data } = await apiClient.patch<ApiResponse<User>>(`/users/${id}/disable`);
    return data.data;
  },
};
