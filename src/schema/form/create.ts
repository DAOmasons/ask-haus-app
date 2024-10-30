import { UseFormReturnType } from '@mantine/form';
import { z } from 'zod';
import { isValidOptionalUrl } from '../../utils/helpers';

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

export type CreatePoll1Schema = z.infer<typeof createPollSchema1>;
export type CreatePoll1Values = UseFormReturnType<
  CreatePoll1Schema,
  (values: CreatePoll1Schema) => CreatePoll1Schema
>;

export const basicChoiceSchema = z.object({
  id: z.string().min(1, 'Choice id is required'),
  title: z.string().min(1, 'Choice title is required'),
  color: z.string().min(1, 'Choice color is required'),
  description: z.string().optional(),
  link: z.string().url().optional(),
});

export const pollMetadataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  pollLink: z.string().optional(),
  description: z.string().optional(),
  answerType: z.string().min(1, 'Answer type is required'),
  requestComment: z.boolean(),
});

export const createPollSchema2 = z.object({
  pollDescription: z.string().optional(),
  pollLink: z.string().refine(isValidOptionalUrl, { message: 'Invalid url' }),
  choices: z.array(basicChoiceSchema),
});

export type CreatePoll2Schema = z.infer<typeof createPollSchema2>;
export type CreatePoll2Values = UseFormReturnType<
  CreatePoll2Schema,
  (values: CreatePoll2Schema) => CreatePoll2Schema
>;
