import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useList<T>(key: string, url: string, params?: Record<string, any>) {
  return useQuery({ queryKey: [key, params], queryFn: async () => (await api.get(url, { params })).data as T });
}

export function useCreate<T>(key: string, url: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => (await api.post(url, payload)).data as T,
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });
}

export function useUpdate<T>(key: string, url: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => (await api.put(url, payload)).data as T,
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });
}

export function useDelete(key: string, url: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async () => (await api.delete(url)).data, onSuccess: () => qc.invalidateQueries({ queryKey: [key] }) });
}
