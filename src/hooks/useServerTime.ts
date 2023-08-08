import { fetcher } from '@/lib/fetcher';
import useSWR from 'swr';

export function useServerTime() {
  const { data, mutate } = useSWR<string>(`/time`, fetcher);

  return { data: new Date(data!), mutate };
}
