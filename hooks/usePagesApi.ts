import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPage,
  deletePage,
  getPageById,
  listPages,
  updatePage,
  CreatePageRequest,
  UpdatePageRequest,
  PageEntity,
} from '@/services/pages';
import { ApiResponse } from '@/types/auth';

export function usePages(enabled: boolean = true) {
  return useQuery<ApiResponse<PageEntity[]>, Error>({
    queryKey: ['pages'],
    queryFn: listPages,
    enabled,
    retry: 1,
  });
}

export function usePage(pageId?: number | string, enabled: boolean = true) {
  return useQuery<ApiResponse<PageEntity>, Error>({
    queryKey: ['pages', pageId],
    queryFn: () => getPageById(pageId as number | string),
    enabled: enabled && !!pageId,
    retry: 1,
  });
}

export function useCreatePage() {
  const qc = useQueryClient();
  return useMutation<ApiResponse<PageEntity>, Error, CreatePageRequest>({
    mutationFn: createPage,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pages'] });
    },
  });
}

export function useUpdatePage() {
  const qc = useQueryClient();
  return useMutation<ApiResponse<PageEntity>, Error, { id: number | string; data: UpdatePageRequest}>({
    mutationFn: ({ id, data }) => updatePage(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['pages'] });
      qc.invalidateQueries({ queryKey: ['pages', variables.id] });
    },
  });
}

export function useDeletePage() {
  const qc = useQueryClient();
  return useMutation<ApiResponse<null>, Error, number | string>({
    mutationFn: deletePage,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pages'] });
    },
  });
}


