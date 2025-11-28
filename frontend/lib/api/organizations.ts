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
};

