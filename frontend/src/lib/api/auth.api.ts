import type { ApiResponse } from '@/lib/types/api';
import type { LoginResult } from '@/lib/types/auth';
import { apiClient } from './client';

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResult> => {
    const { data } = await apiClient.post<ApiResponse<LoginResult>>('/auth/login', { email, password });
    return data.data;
  },
};
