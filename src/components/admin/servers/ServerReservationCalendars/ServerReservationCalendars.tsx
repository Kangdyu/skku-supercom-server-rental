import { useReservationDates } from '@/hooks/useReservationDates';
import { useServer } from '@/hooks/useServer';
import { Group, Text, Title } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import dayjs from 'dayjs';

interface ServerReservationCalendarsProps {
  serverId: number;
}

export function ServerReservationCalendars({ serverId }: ServerReservationCalendarsProps) {
  const { data: server } = useServer(serverId);
  const { data: reservationDates } = useReservationDates(serverId);

  const availableMonths = server.serverAvailability.map((a) => `${a.year}-${a.month}`);

  return (
    <>
      <Group align="end">
        <Title order={3}>달력 보기</Title>
        <Text color="gray" size="sm">
          예약된 날짜는 초록색으로 표시됩니다.
        </Text>
      </Group>
      <Group align="top">
        {availableMonths.map((month) => (
          <Calendar
            key={month}
            static
            level="month"
            date={new Date(month)}
            getDayProps={(date) => {
              const isReservationDate = reservationDates?.some((r) => dayjs(r).isSame(date, 'day'));
              return {
                selected: isReservationDate,
              };
            }}
            hideOutsideDates
            styles={{
              calendarHeaderControl: {
                display: 'none',
              },
            }}
          />
        ))}
      </Group>
    </>
  );
}
