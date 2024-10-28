import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const SECONDS_IN_DAY = 86400;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MINUTE = 60;

export const futureRelativeTimeInSeconds = (
  unixTimestamp: number,
  format = true
) => {
  const now = dayjs();
  const end = dayjs.unix(unixTimestamp);

  const diff = end.diff(now, 'second');

  const days = Math.floor(diff / SECONDS_IN_DAY);
  const remainingSeconds = diff % SECONDS_IN_DAY;

  const hours = Math.floor(remainingSeconds / SECONDS_IN_HOUR);
  const remainingAfterHours = remainingSeconds % SECONDS_IN_HOUR;

  const minutes = Math.floor(remainingAfterHours / SECONDS_IN_MINUTE);
  const seconds = remainingAfterHours % SECONDS_IN_MINUTE;

  if (format) {
    if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    if (seconds > 0) return `${seconds}s`;
    return '0s';
  }

  return {
    d: days,
    h: hours,
    m: minutes,
    s: seconds,
  };
};

export const pastRelativeTimeInSeconds = (
  unixTimestamp: number,
  format = true
) => {
  const now = dayjs();
  const past = dayjs.unix(unixTimestamp);

  const diff = now.diff(past, 'second'); // Swapped order of diff to get positive values

  const days = Math.floor(diff / SECONDS_IN_DAY);
  const remainingSeconds = diff % SECONDS_IN_DAY;

  const hours = Math.floor(remainingSeconds / SECONDS_IN_HOUR);
  const remainingAfterHours = remainingSeconds % SECONDS_IN_HOUR;

  const minutes = Math.floor(remainingAfterHours / SECONDS_IN_MINUTE);
  const seconds = remainingAfterHours % SECONDS_IN_MINUTE;

  if (format) {
    if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    if (seconds > 0) return `${seconds}s`;
    return '0s';
  }
  return {
    d: days,
    h: hours,
    m: minutes,
    s: seconds,
  };
};

export const dateToSeconds = (date: Date) => {
  return dayjs(date).unix();
};

export const nowInSeconds = () => {
  return dayjs().unix();
};

export const Times = {
  'Five Minutes': 60 * 5,
  'One Hour': 60 * 60,
  'One Day': 60 * 60 * 24,
  'One Week': 60 * 60 * 24 * 7,
};

//   const endTime = useMemo(() => {
//     if (!prevForm.values.time) {
//       return 0;
//     }

//     if (prevForm.values.time !== 'Custom') {
//       const length = Times[prevForm.values.time as keyof typeof Times];
//       return Math.floor((Date.now() + length * 1000) / 1000);
//     } else if (prevForm.values.customTimeEnd) {
//       return dateToSeconds(prevForm.values.customTimeEnd);
//     } else {
//       return 0;
//     }
//   }, [prevForm]);
