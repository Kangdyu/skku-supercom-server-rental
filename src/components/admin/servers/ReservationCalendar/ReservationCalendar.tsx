import { useReservationDates } from '@/hooks/useReservationDates';
import { useServer } from '@/hooks/useServer';
import { formatDate } from '@/lib/date';
import {
  Center,
  Group,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { Calendar, CalendarLevel, CalendarProps } from '@mantine/dates';
import dayjs from 'dayjs';
import { useState } from 'react';

interface ReservationCalendarProps extends CalendarProps {
  serverId: number;
}

export function ReservationCalendar({ serverId, ...props }: ReservationCalendarProps) {
  const [displayingDate, setDisplayingDate] = useState<Date>(new Date());
  const [level, setLevel] = useState<CalendarLevel>('month');

  const { data: takenDates } = useReservationDates(serverId);
  const { data: server } = useServer(serverId);
  const availableDates = server?.serverAvailability.map((a) =>
    formatDate(`${a.year}-${a.month}`, 'YYYY-MM'),
  );

  const onClickYearMonthButton = (year: number, month: number) => {
    setDisplayingDate(new Date(year, month - 1, 1));
    setLevel('month');
  };

  return (
    <Group>
      <Stack h="400px" maw="400px" w="100%">
        <Stack spacing="8px">
          <Title order={3}>달력 보기</Title>
          <Text size="sm" color="gray">
            예약된 날이 있는 달과 예약된 날은 초록색 배경으로 표시됩니다.
          </Text>
        </Stack>

        <ScrollArea h="100%">
          <SimpleGrid cols={3}>
            {availableDates.map((yearMonth) => {
              const [year, month] = yearMonth.split('-').map(Number);

              return (
                <UnstyledButton key={yearMonth} onClick={() => onClickYearMonthButton(year, month)}>
                  <Paper
                    withBorder
                    p="12px"
                    sx={(theme) => ({
                      backgroundColor: takenDates.some(
                        (date) => date.getFullYear() === year && date.getMonth() + 1 === month,
                      )
                        ? theme.colors.green[1]
                        : 'transparent',
                      borderColor:
                        formatDate(displayingDate, 'YYYY-MM') === yearMonth
                          ? `${theme.colors.green[5]} !important`
                          : `${theme.colors.gray[3]} !important`,
                    })}
                  >
                    <Center>
                      <Text fw={500}>{yearMonth}</Text>
                    </Center>
                  </Paper>
                </UnstyledButton>
              );
            })}
          </SimpleGrid>
        </ScrollArea>
      </Stack>

      <Stack>
        <Calendar
          size="md"
          minDate={new Date()}
          date={displayingDate}
          onDateChange={(date) => {
            setDisplayingDate(date);
          }}
          level={level}
          onLevelChange={setLevel}
          getDayProps={(date) => {
            const isReservationDate = takenDates.some((d) => dayjs(d).isSame(date, 'day'));
            return {
              selected: isReservationDate,
            };
          }}
          getMonthControlProps={(date) => {
            const yearMonth = formatDate(`${date.getFullYear()}-${date.getMonth() + 1}`, 'YYYY-MM');

            if (!availableDates.includes(yearMonth)) {
              return { disabled: true };
            }

            return {};
          }}
          hideOutsideDates
          styles={{
            monthLevel: {
              '.mantine-Calendar-calendarHeaderControl': {
                display: 'none',
              },
            },
          }}
          {...props}
        />
      </Stack>
    </Group>
  );
}
