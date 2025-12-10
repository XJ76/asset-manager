import { apiClient } from './client';
import type { WarrantyRegistration } from '@/types';

const WARRANTY_API_URL = process.env.NEXT_PUBLIC_WARRANTY_API_URL || 'https://server20.eport.ws';
const WARRANTY_API_KEY = process.env.NEXT_PUBLIC_WARRANTY_API_KEY || '';

// Create a separate client for warranty API
const warrantyClient = {
  get: async <T>(url: string): Promise<T> => {
    const response = await fetch(`${WARRANTY_API_URL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': WARRANTY_API_KEY,
      },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
  
  post: async <T>(url: string, data: unknown): Promise<T> => {
    const response = await fetch(`${WARRANTY_API_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': WARRANTY_API_KEY,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
};

export const warrantyApi = {
  register: async (assetData: {
    assetId: string;
    assetName: string;
    categoryId?: string;
    departmentId?: string;
    datePurchased?: string;
    cost?: number;
    registeredBy: string;
    registeredByName: string;
    organizationId?: string;
  }): Promise<{ success: boolean; message: string; registration: WarrantyRegistration }> => {
    return warrantyClient.post('/api/register', assetData);
  },

  getAll: async (): Promise<{ success: boolean; registrations: WarrantyRegistration[] }> => {
    return warrantyClient.get('/api/registrations');
  },

  checkStatus: async (assetId: string): Promise<{ success: boolean; registered: boolean; registration?: WarrantyRegistration }> => {
    return warrantyClient.get(`/api/registrations/${assetId}`);
  },
};

