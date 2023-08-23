import { fetcher } from '@/lib/fetcher';
import useSWR from 'swr';

interface useReservationDatesOptions {
  reservationId?: number;
  serverId?: number;
  year?: number;
  month?: number;
}

export function useReservationDates({
  reservationId,
  serverId,
  ...queryParams
}: useReservationDatesOptions) {
  if (!reservationId && !serverId)
    throw new Error('useReservationDates: reservationId와 serverId 둘 중 하나를 지정해야 합니다.');

  if (reservationId && serverId)
    throw new Error('useReservationDates: reservationId와 serverId 둘 중 하나만 지정해야 합니다.');

  const searchParamObject = queryParams
    ? Object.fromEntries(
        Object.entries(queryParams)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)]),
      )
    : {};
  const searchParams = new URLSearchParams(searchParamObject);

  let endpoint;
  if (reservationId) endpoint = `/reservations/${reservationId}/reservationDates`;
  else if (serverId) endpoint = `/servers/${serverId}/reservationDates`;

  const { data, mutate } = useSWR<Date[]>(`${endpoint}?${searchParams}`, fetcher);

  return { data: data!.map((date) => new Date(date)), mutate };
}
