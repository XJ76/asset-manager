import { create } from 'zustand';
import { departmentsApi } from '@/lib/api/departments';
import type { Department } from '@/types';
import type { DepartmentFormData } from '@/types/forms';

interface DepartmentsState {
  departments: Department[];
  isLoading: boolean;
  error: string | null;
  fetchDepartments: () => Promise<void>;
  createDepartment: (department: DepartmentFormData) => Promise<void>;
  updateDepartment: (id: string, department: DepartmentFormData) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
}

export const useDepartmentsStore = create<DepartmentsState>((set) => ({
  departments: [],
  isLoading: false,
  error: null,
  fetchDepartments: async () => {
    set({ isLoading: true, error: null });
    try {
      const departments = await departmentsApi.getAll();
      set({ departments, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  createDepartment: async (department) => {
    set({ isLoading: true, error: null });
    try {
      const newDepartment = await departmentsApi.create(department);
      set((state) => ({
        departments: [...state.departments, newDepartment],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  updateDepartment: async (id, department) => {
    set({ isLoading: true, error: null });
    try {
      const updatedDepartment = await departmentsApi.update(id, department);
      set((state) => ({
        departments: state.departments.map((d) => (d.id === id ? updatedDepartment : d)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  deleteDepartment: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await departmentsApi.delete(id);
      set((state) => ({
        departments: state.departments.filter((d) => d.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));

