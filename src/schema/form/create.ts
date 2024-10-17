import { z } from 'zod';

export const createPollSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    details: z.string(),
    time: z.string().min(1, 'Time is required'),
    customTimeStart: z.string(),
    customTimeEnd: z.string().optional(),
    answerType: z.string().min(1, 'Answer type is required'),
    tokenType: z.string().min(1, 'Token type is required'),
    choices: z.array(z.string()),
  })
  .refine(
    ({ customTimeStart, time }) => time === 'custom' && !customTimeStart,
    {
      message: 'Start time is required if custom is selected',
      path: ['customTimeStart'],
    }
  )
  .refine(({ customTimeEnd, time }) => time === 'custom' && !customTimeEnd, {
    message: 'End time is required if custom is selected',
    path: ['customTimeEnd'],
  });
