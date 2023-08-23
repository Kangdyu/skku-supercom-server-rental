import { useReservationDates } from '@/hooks/useReservationDates';
import { Calendar } from '@mantine/dates';
import dayjs from 'dayjs';

interface ServerReservationCalendarProps {
  serverId: number;
  year: number;
  month: number;
}

export function ServerReservationCalendar({
  serverId,
  year,
  month,
}: ServerReservationCalendarProps) {
  const { data: reservationDates } = useReservationDates({ serverId, year, month });

  return (
    <Calendar
      static
      level="month"
      date={new Date(year, month - 1)}
      getDayProps={(date) => {
        const isReservationDate = reservationDates?.some((r) => dayjs(r).isSame(date, 'day'));
        return {
          disabled: isReservationDate,
        };
      }}
      hideOutsideDates
      styles={{
        calendarHeaderControl: {
          display: 'none',
        },
      }}
    />
  );
}
