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
};

