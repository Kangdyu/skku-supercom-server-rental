import { fetcher } from '@/lib/fetcher';
import useSWR from 'swr';

export function useReservationDates(serverId: number, options?: { year?: number; month?: number }) {
  const searchParamObject = options
    ? Object.fromEntries(
        Object.entries(options)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)]),
      )
    : {};
  const searchParams = new URLSearchParams(searchParamObject);

  const { data, mutate } = useSWR<Date[]>(
    `/servers/${serverId}/reservationDates?${searchParams}`,
    fetcher,
  );

  return { data: data!, mutate };
}
