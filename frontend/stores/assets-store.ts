import { create } from 'zustand';
import { assetsApi } from '@/lib/api/assets';
import type { Asset } from '@/types';
import type { AssetFormData } from '@/types/forms';

interface AssetsState {
  assets: Asset[];
  isLoading: boolean;
  error: string | null;
  fetchAssets: () => Promise<void>;
  createAsset: (asset: AssetFormData) => Promise<void>;
  updateAsset: (id: string, asset: AssetFormData) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
}

export const useAssetsStore = create<AssetsState>((set, get) => ({
  assets: [],
  isLoading: false,
  error: null,
  fetchAssets: async () => {
    set({ isLoading: true, error: null });
    try {
      const assets = await assetsApi.getAll();
      set({ assets, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  createAsset: async (asset) => {
    set({ isLoading: true, error: null });
    try {
      const newAsset = await assetsApi.create(asset);
      set((state) => ({
        assets: [...state.assets, newAsset],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  updateAsset: async (id, asset) => {
    set({ isLoading: true, error: null });
    try {
      const updatedAsset = await assetsApi.update(id, asset);
      set((state) => ({
        assets: state.assets.map((a) => (a.id === id ? updatedAsset : a)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  deleteAsset: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await assetsApi.delete(id);
      set((state) => ({
        assets: state.assets.filter((a) => a.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));

