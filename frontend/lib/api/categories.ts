import { apiClient } from './client';
import type { Category } from '@/types';
import type { CategoryFormData } from '@/types/forms';

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>('/categories');
    return data;
  },

  create: async (category: CategoryFormData): Promise<Category> => {
    const { data } = await apiClient.post<Category>('/categories', category);
    return data;
  },

  update: async (id: string, category: CategoryFormData): Promise<Category> => {
    const { data } = await apiClient.put<Category>(`/categories/${id}`, category);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};

