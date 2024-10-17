import { z } from 'zod';

export const createPollSchema1 = z
  .object({
    title: z.string().min(1, 'Title is required'),
    answerType: z.string().min(1, 'Answer type is required'),
    tokenType: z.string().min(1, 'Token type is required'),
    time: z.string().min(1, 'Time is required'),
    customTimeStart: z.date(),
    customTimeEnd: z.date(),
  })
  .refine(
    ({ customTimeStart, time }) => {
      console.log({ customTimeStart, time });
      return time === 'Custom' && !customTimeStart ? false : true;
    },
    {
      message: 'Start time is required if custom is selected',
      path: ['customTimeStart'],
    }
  )
  .refine(
    ({ customTimeEnd, time }) =>
      time === 'custom' && !customTimeEnd ? false : true,
    {
      message: 'End time is required if custom is selected',
      path: ['customTimeEnd'],
    }
  );

export const createPollSchema2 = z.object({
  tokenType: z.string().min(1, 'Token type is required'),
});

export const createPollSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  details: z.string(),
  answerType: z.string().min(1, 'Answer type is required'),
  tokenType: z.string().min(1, 'Token type is required'),
  choices: z.array(z.string()),
});