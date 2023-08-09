import { useReservationDates } from '@/hooks/useReservationDates';
import { useServer } from '@/hooks/useServer';
import { DatePickerInput, DatePickerInputProps } from '@mantine/dates';
import dayjs from 'dayjs';
import { ForwardedRef, forwardRef, useState } from 'react';

interface ReservationCalendarProps extends Omit<DatePickerInputProps, 'value'> {
  serverId: number;
  value: Date[];
}

function ReservationCalendarInputBase(
  { serverId, ...props }: ReservationCalendarProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const { data: takenDates } = useReservationDates(serverId);
  const { data: server } = useServer(serverId);
  const availableDates = server?.serverAvailability.map((a) => `${a.year}-${a.month}`);

  return (
    <DatePickerInput
      ref={ref}
      type="multiple"
      label="예약 날짜"
      defaultLevel="year"
      minDate={new Date()}
      excludeDate={(date) => {
        return takenDates.some((d) => dayjs(d).isSame(date, 'day'));
      }}
      getMonthControlProps={(date) => {
        const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;

        if (!availableDates.includes(yearMonth)) {
          return { disabled: true };
        }

        return {};
      }}
      hideOutsideDates
      withAsterisk
      {...props}
    />
  );
}

export const ReservationCalendarInput = forwardRef(ReservationCalendarInputBase);
