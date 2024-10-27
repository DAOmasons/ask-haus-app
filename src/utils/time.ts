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

export const pastRelativeTimeInSeconds = (seconds: number) => {
  const now = dayjs();
  const end = dayjs.unix(seconds - 1); // Convert UTC timestamp to dayjs object
  const diff = dayjs.duration(now.diff(end)); // Swap end and now

  const days = Math.floor(diff.asDays());
  const hours = diff.hours();
  const minutes = diff.minutes();
  const secondsLeft = diff.seconds();

  return { d: days, h: hours, m: minutes, s: secondsLeft };
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
