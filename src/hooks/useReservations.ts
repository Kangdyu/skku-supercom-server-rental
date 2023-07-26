import { fetcher } from '@/lib/fetcher';
import { createQueryString } from '@/lib/queryString';
import { PaginationResponse, ReservationResponse } from '@/types/api';
import useSWR from 'swr';

type Options = {
  pageSize: number | string;
  pageNumber: number | string;
  serverId?: number | string;
  userId?: number | string;
};

export function useReservations(options: Options) {
  const searchParams = createQueryString(options);

  const { data, mutate } = useSWR<PaginationResponse<ReservationResponse>>(
    `/reservations?${searchParams.toString()}`,
    fetcher,
  );

  return { data: data!, mutate };
}
