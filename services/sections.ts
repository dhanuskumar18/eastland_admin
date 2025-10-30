import { apiClient } from './axios';
import { ApiResponse } from '@/types/auth';

export interface SectionTranslation {
  locale: string;
  content: any;
}

export interface SectionEntity {
  id: number;
  name: string;
  pageId: number;
  translations?: SectionTranslation[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSectionRequest {
  name: string;
  pageId: number;
  translations?: SectionTranslation[];
}

export interface UpdateSectionRequest {
  name?: string;
  pageId?: number;
  translations?: SectionTranslation[];
}

export async function createSection(payload: CreateSectionRequest): Promise<ApiResponse<SectionEntity>> {
  const res = await apiClient.post('/sections', payload);
  return res.data;
}

export async function listSections(pageId?: number): Promise<ApiResponse<SectionEntity[]>> {
  const res = await apiClient.get('/sections', {
    params: pageId ? { pageId } : undefined,
  });
  const raw = res.data;
  const items = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw?.data?.items)
    ? raw.data.items
    : Array.isArray(raw?.sections)
    ? raw.sections
    : Array.isArray(raw?.data?.sections)
    ? raw.data.sections
    : [];
  return {
    version: raw?.version ?? '1',
    validationErrors: [],
    code: raw?.code ?? 200,
    status: raw?.status ?? true,
    message: raw?.message ?? 'OK',
    data: items as SectionEntity[],
  };
}

export async function getSectionById(id: number | string): Promise<ApiResponse<SectionEntity>> {
  const res = await apiClient.get(`/sections/${id}`);
  return res.data;
}

export async function updateSection(id: number | string, payload: UpdateSectionRequest): Promise<ApiResponse<SectionEntity>> {
  const res = await apiClient.patch(`/sections/${id}`, payload);
  return res.data;
}

export async function deleteSection(id: number | string): Promise<ApiResponse<null>> {
  const res = await apiClient.delete(`/sections/${id}`);
  return res.data;
}


