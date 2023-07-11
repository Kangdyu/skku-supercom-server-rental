'use client';

import { DatePicker } from 'antd';
import type {} from 'antd/es/';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useState } from 'react';

dayjs.extend(customParseFormat);

const BANNED_DATES = [
  dayjs('2023-07-13'),
  dayjs('2023-07-14'),
  dayjs('2023-07-15'),
  dayjs('2023-07-20'),
  dayjs('2023-07-22'),
  dayjs('2023-07-23'),
];

function disabledDate(current: Dayjs) {
  return BANNED_DATES.some((date) => date.isSame(current, 'day'));
}

function isDateInRangeDisabled(start: Dayjs, end: Dayjs) {
  const day = 24 * 60 * 60 * 1000;
  for (let i = start.valueOf(); i <= end.valueOf(); i += day) {
    if (BANNED_DATES.some((date) => date.isSame(dayjs(i), 'day'))) {
      return true;
    }
  }
  return false;
}

export default function Page() {
  const [dates, setDates] = useState<[Dayjs | null, Dayjs | null]>([null, null]);

  return (
    <DatePicker.RangePicker
      value={dates}
      disabledDate={disabledDate}
      onCalendarChange={(dates) => {
        if (
          dates &&
          dates.length === 2 &&
          isDateInRangeDisabled(dayjs(dates[0]), dayjs(dates[1]))
        ) {
          alert('불가능한 날짜가 포함되어 있습니다.');
          setDates([null, null]);
          return;
        }
        if (dates) {
          setDates(dates);
        }
      }}
    />
  );
}
