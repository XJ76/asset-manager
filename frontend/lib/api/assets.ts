import { apiClient } from './client';
import type { Asset } from '@/types';
import type { AssetFormData } from '@/types/forms';

export const assetsApi = {
  getAll: async (): Promise<Asset[]> => {
    const { data } = await apiClient.get<Asset[]>('/assets');
    return data;
  },

  create: async (asset: AssetFormData): Promise<Asset> => {
    const { data } = await apiClient.post<Asset>('/assets', asset);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/assets/${id}`);
  },
};

