import { create } from 'zustand';
import { categoriesApi } from '@/lib/api/categories';
import type { Category } from '@/types';
import type { CategoryFormData } from '@/types/forms';

interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (category: CategoryFormData) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  isLoading: false,
  error: null,
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await categoriesApi.getAll();
      set({ categories, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  createCategory: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const newCategory = await categoriesApi.create(category);
      set((state) => ({
        categories: [...state.categories, newCategory],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await categoriesApi.delete(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));

