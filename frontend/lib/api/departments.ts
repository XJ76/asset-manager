import { apiClient } from './client';
import type { Department } from '@/types';
import type { DepartmentFormData } from '@/types/forms';

export const departmentsApi = {
  getAll: async (): Promise<Department[]> => {
    const { data } = await apiClient.get<Department[]>('/departments');
    return data;
  },

  create: async (department: DepartmentFormData): Promise<Department> => {
    const { data } = await apiClient.post<Department>('/departments', department);
    return data;
  },

  update: async (id: string, department: DepartmentFormData): Promise<Department> => {
    const { data } = await apiClient.put<Department>(`/departments/${id}`, department);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/departments/${id}`);
  },
};

