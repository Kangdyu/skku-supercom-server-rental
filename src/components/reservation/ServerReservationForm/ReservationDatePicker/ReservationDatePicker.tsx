import { useReservationDates } from '@/hooks/useReservationDates';
import { useServer } from '@/hooks/useServer';
import { formatDate } from '@/lib/date';
import {
  Button,
  Center,
  Group,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { CalendarLevel, DatePicker, DatePickerInput, DatePickerProps } from '@mantine/dates';
import dayjs from 'dayjs';
import { ForwardedRef, forwardRef, useRef, useState } from 'react';

interface ReservationDatePickerBaseProps
  extends Omit<DatePickerProps<'multiple'>, 'value' | 'onChange'> {
  serverId: number;
  value: Date[];
  onChange: (value: Date[]) => void;
  error?: string;
}

function ReservationDatePickerBase(
  { serverId, value, onChange, error, ...props }: ReservationDatePickerBaseProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const pickerRef = useRef<HTMLDivElement>(null);

  const [displayingDate, setDisplayingDate] = useState<Date>(new Date());
  const [level, setLevel] = useState<CalendarLevel>('month');

  const { data: takenDates } = useReservationDates(serverId);
  const { data: server } = useServer(serverId);
  const availableDates = server?.serverAvailability.map((a) =>
    formatDate(`${a.year}-${a.month}`, 'YYYY-MM'),
  );

  /**
   * NOTE: 현재 DOM 조작을 통해 disabled 상태가 아닌 날짜의 버튼을 받아와 처리하고 있음
   */
  const onClickAllSelectButton = () => {
    if (!pickerRef.current || !displayingDate) return;

    const dayButtonElements =
      pickerRef.current.querySelectorAll<HTMLButtonElement>('.mantine-DatePicker-day');
    const activeDays = Array.from(dayButtonElements)
      .filter((day) => !day.disabled && !day.dataset.hidden)
      .map(
        (day) =>
          new Date(
            displayingDate.getFullYear(),
            displayingDate.getMonth(),
            Number(day.textContent),
          ),
      );

    onChange([...value, ...activeDays]);
  };

  const onClickYearMonthButton = (year: number, month: number) => {
    setDisplayingDate(new Date(year, month - 1, 1));
    setLevel('month');
  };

  return (
    <Group position="apart">
      <Stack h="400px" sx={{ flex: 1 }}>
        <Stack spacing="8px">
          <Text size="sm" color="gray.9" fw={500}>
            예약 날짜
          </Text>
          <Text size="sm" color="gray">
            선택된 날짜가 있는 달은 초록색 배경으로 표시됩니다.
          </Text>
          {error && (
            <Text size="sm" color="red" fw={500}>
              {error}
            </Text>
          )}
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
                      backgroundColor: value.some(
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
        <DatePicker
          ref={pickerRef}
          size="md"
          type="multiple"
          minDate={new Date()}
          value={value}
          onChange={(dates) => {
            onChange(dates as Date[]);
          }}
          date={displayingDate}
          onDateChange={(date) => {
            setDisplayingDate(date);
          }}
          level={level}
          onLevelChange={setLevel}
          excludeDate={(date) => {
            return takenDates.some((d) => dayjs(d).isSame(date, 'day'));
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
              '.mantine-DatePicker-calendarHeaderControl': {
                display: 'none',
              },
            },
          }}
          {...props}
        />
        {level === 'month' && (
          <Group grow>
            <Button onClick={onClickAllSelectButton} variant="outline">
              모두 선택
            </Button>
          </Group>
        )}
      </Stack>
    </Group>
  );
}

export const ReservationDatePicker = forwardRef(ReservationDatePickerBase);
