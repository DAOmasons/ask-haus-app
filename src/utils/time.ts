import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const futureRelativeTimeInSeconds = (seconds: number) => {
  const now = dayjs();
  const end = now.add(seconds, 'second');
  const diff = dayjs.duration(end.diff(now));

  const days = Math.floor(diff.asDays());
  const hours = diff.hours();
  const minutes = diff.minutes();
  const secondsLeft = diff.seconds();

  return { h: hours, d: days, m: minutes, s: secondsLeft };
};
