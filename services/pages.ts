import { apiClient } from './axios';
import { ApiResponse } from '@/types/auth';

export interface PageEntity {
  id: number;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePageRequest {
  name: string;
  slug: string;
}

export interface UpdatePageRequest {
  name?: string;
  slug?: string;
}

export async function createPage(payload: CreatePageRequest): Promise<ApiResponse<PageEntity>> {
  const res = await apiClient.post('/pages', payload);
  return res.data;
}

export async function listPages(): Promise<ApiResponse<PageEntity[]>> {
  const res = await apiClient.get('/pages', {
    params: { limit: 50, offset: 0 },
  });
  const raw = res.data;
  let items: any[] = [];
  if (Array.isArray(raw)) {
    items = raw;
  } else if (Array.isArray(raw?.data)) {
    items = raw.data;
  } else if (Array.isArray(raw?.data?.items)) {
    items = raw.data.items;
  } else if (Array.isArray(raw?.pages)) {
    items = raw.pages;
  } else if (Array.isArray(raw?.data?.pages)) {
    items = raw.data.pages;
  }
  return {
    version: raw?.version ?? '1',
    validationErrors: [],
    code: raw?.code ?? 200,
    status: raw?.status ?? true,
    message: raw?.message ?? 'OK',
    data: items as PageEntity[],
  };
}

export async function getPageById(id: number | string): Promise<ApiResponse<PageEntity>> {
  const res = await apiClient.get(`/pages/${id}`);
  return res.data;
}

export async function updatePage(id: number | string, payload: UpdatePageRequest): Promise<ApiResponse<PageEntity>> {
  const res = await apiClient.patch(`/pages/${id}`, payload);
  return res.data;
}

export async function deletePage(id: number | string): Promise<ApiResponse<null>> {
  const res = await apiClient.delete(`/pages/${id}`);
  return res.data;
}


