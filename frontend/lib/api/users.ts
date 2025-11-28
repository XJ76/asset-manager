import { apiClient } from './client';
import type { User } from '@/types';

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const { data } = await apiClient.get<User[]>('/users');
    return data;
  },

  approve: async (id: string): Promise<User> => {
    const { data } = await apiClient.patch<User>(`/users/${id}/approve`);
    return data;
  },

  reject: async (id: string): Promise<User> => {
    const { data } = await apiClient.patch<User>(`/users/${id}/reject`);
    return data;
  },
};

