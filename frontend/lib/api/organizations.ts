import { apiClient } from './client';
import type { Organization } from '@/types';
import type { CreateOrgSignup } from '@/types/auth';

export interface CreateOrgResponse {
  organization: Organization;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
    organizationId: string;
  };
  token: string;
}

export const organizationsApi = {
  create: async (data: CreateOrgSignup): Promise<CreateOrgResponse> => {
    const { data: response } = await apiClient.post<CreateOrgResponse>('/organizations', {
      name: data.organizationName,
      email: data.email,
      userName: data.name,
      userRole: 'admin',
      password: data.password,
    });
    return response;
  },

  getAll: async (): Promise<Organization[]> => {
    try {
      const { data } = await apiClient.get<Organization[]>('/organizations');
      return data;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || error.message?.includes('Network Error')) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
        const isProduction = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');
        const message = isProduction
          ? 'Backend service is starting up. Please wait a moment and try again. (Render free tier may take up to 50 seconds to wake up)'
          : `Cannot connect to backend at ${apiUrl}. Make sure the backend server is running.`;
        throw new Error(message);
      }
      throw error;
    }
  },
};

