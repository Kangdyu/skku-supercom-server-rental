import dayjs from 'dayjs';

export function formatDate(date: Date | string, format: 'hyphen' | string = 'hyphen') {
  return dayjs(date).format(format === 'hyphen' ? 'YYYY-MM-DD' : format);
}
