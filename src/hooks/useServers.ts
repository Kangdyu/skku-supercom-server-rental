import { fetcher } from '@/lib/fetcher';
import { PaginationResponse, ServerResponse } from '@/types/api';
import useSWR from 'swr';

interface Options {
  pageSize: number | string;
  pageNumber: number | string;
}

export function useServers(options: Options) {
  const searchParamObject = Object.fromEntries(
    Object.entries(options)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)]),
  );
  const searchParams = new URLSearchParams(searchParamObject);

  const { data, mutate } = useSWR<PaginationResponse<ServerResponse>>(
    `/servers?${searchParams.toString()}`,
    fetcher,
  );

  return { data: data!, mutate };
}
