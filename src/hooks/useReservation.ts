import { fetcher } from '@/lib/fetcher';
import { ReservationResponse } from '@/types/api';
import useSWR from 'swr';

export function useReservation(reservationId: number) {
  const { data, mutate } = useSWR<ReservationResponse>(`/reservations/${reservationId}`, fetcher);

  return { data: data!, mutate };
}
