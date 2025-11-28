import { create } from 'zustand';
import { usersApi } from '@/lib/api/users';
import type { User } from '@/types';

interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  approveUser: (id: string) => Promise<void>;
  rejectUser: (id: string) => Promise<void>;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  isLoading: false,
  error: null,
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await usersApi.getAll();
      set({ users, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  approveUser: async (id) => {
    try {
      const updated = await usersApi.approve(id);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? updated : u)),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
  rejectUser: async (id) => {
    try {
      const updated = await usersApi.reject(id);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? updated : u)),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));

