import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const futureRelativeTimeInSeconds = (seconds: number) => {
  const now = dayjs();
  const end = dayjs.unix(seconds + 1); // Convert UTC timestamp to dayjs object
  const diff = dayjs.duration(end.diff(now)); // Swap end and now

  const days = Math.floor(diff.asDays());
  const hours = diff.hours();
  const minutes = diff.minutes();
  const secondsLeft = diff.seconds();

  return { d: days, h: hours, m: minutes, s: secondsLeft };
};

export const dateToSeconds = (date: Date) => {
  return dayjs(date).unix();
};

export const Times = {
  'Five Minutes': 60 * 5,
  'One Hour': 60 * 60,
  'One Day': 60 * 60 * 24,
  'One Week': 60 * 60 * 24 * 7,
};
