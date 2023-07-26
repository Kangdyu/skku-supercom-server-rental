import { fetcher } from '@/lib/fetcher';
import { ServerResponse } from '@/types/api';
import useSWR from 'swr';

export function useServer(serverId: number) {
  const { data, mutate } = useSWR<ServerResponse>(`/servers/${serverId}`, fetcher);

  return { data: data!, mutate };
}
