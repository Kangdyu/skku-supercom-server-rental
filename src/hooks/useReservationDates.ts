import { fetcher } from '@/lib/fetcher';
import useSWR from 'swr';

export function useReservationDates(serverId: number) {
  const { data, mutate } = useSWR<Date[]>(`/servers/${serverId}/reservationDates`, fetcher);

  return { data: data!, mutate };
}
