import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSection,
  deleteSection,
  getSectionById,
  listSections,
  updateSection,
  CreateSectionRequest,
  UpdateSectionRequest,
  SectionEntity,
} from '@/services/sections';
import { ApiResponse } from '@/types/auth';

export function useSections(pageId?: number, enabled: boolean = true) {
  return useQuery<ApiResponse<SectionEntity[]>, Error>({
    queryKey: ['sections', pageId],
    queryFn: () => listSections(pageId),
    enabled,
    retry: 1,
  });
}

export function useSection(sectionId?: number | string, enabled: boolean = true) {
  return useQuery<ApiResponse<SectionEntity>, Error>({
    queryKey: ['sections', sectionId],
    queryFn: () => getSectionById(sectionId as number | string),
    enabled: enabled && !!sectionId,
    retry: 1,
  });
}

export function useCreateSection() {
  const qc = useQueryClient();
  return useMutation<ApiResponse<SectionEntity>, Error, CreateSectionRequest>({
    mutationFn: createSection,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sections'] });
    },
  });
}

export function useUpdateSection() {
  const qc = useQueryClient();
  return useMutation<ApiResponse<SectionEntity>, Error, { id: number | string; data: UpdateSectionRequest}>({
    mutationFn: ({ id, data }) => updateSection(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['sections'] });
      qc.invalidateQueries({ queryKey: ['sections', variables.id] });
    },
  });
}

export function useDeleteSection() {
  const qc = useQueryClient();
  return useMutation<ApiResponse<null>, Error, number | string>({
    mutationFn: deleteSection,
    onSuccess: () => {
      qc.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === 'sections' });
    },
  });
}


