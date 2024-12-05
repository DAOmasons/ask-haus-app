import { UseFormReturnType } from '@mantine/form';
import { z } from 'zod';
import { isValidOptionalUrl } from '../../utils/helpers';
import { tiptapContentSchema } from './tiptapSchema';

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

export const createContestSchema1 = z.object({
  title: z.string().min(1, 'Title is required'),
  description: tiptapContentSchema,
  link: z.string().refine(isValidOptionalUrl, { message: 'Invalid url' }),
});

export type CreateContest1Schema = z.infer<typeof createContestSchema1>;
export type CreateContest1Values = UseFormReturnType<
  CreateContest1Schema,
  (values: CreateContest1Schema) => CreateContest1Schema
>;

export const createContestSchema2 = z
  .object({
    choiceTime: z.string().min(1, 'Submission time is required'),
    customChoiceStart: z.date(),
    customChoiceTimeEnd: z.date(),
    choiceTokenType: z.string().min(1, 'Token type is required'),
    choiceTokenAmount: z
      .number()
      .gt(0, 'Gate token amount must be greater than 0'),
    votingTime: z.string().min(1, 'Voting time is required'),
    voteTokenType: z.string().min(1, 'Token type is required'),
    customVoteStart: z.date(),
    customVoteEnd: z.date(),
    answerType: z.string().min(1, 'Answer type is required'),
  })
  .refine(
    ({ customChoiceStart, customChoiceTimeEnd, choiceTime }) => {
      return (choiceTime === 'Custom' && !customChoiceStart) ||
        ('Custom' && !customChoiceTimeEnd)
        ? false
        : true;
    },
    {
      message: 'Custom choice time is required if selected',
      path: ['customChoiceStart'],
    }
  )
  .refine(
    ({ customVoteStart, customVoteEnd, votingTime }) => {
      return (votingTime === 'Custom' && !customVoteStart) ||
        ('Custom' && !customVoteEnd)
        ? false
        : true;
    },
    {
      message: 'Custom vote time is required if selected',
      path: ['customChoiceStart'],
    }
  );

export type CreateContest2Schema = z.infer<typeof createContestSchema2>;
export type CreateContest2Values = UseFormReturnType<
  CreateContest2Schema,
  (values: CreateContest2Schema) => CreateContest2Schema
>;

export const basicChoiceSchema = z.object({
  id: z.string().min(1, 'Choice id is required'),
  title: z.string().min(1, 'Choice title is required'),
  color: z.string().min(1, 'Choice color is required'),
  description: z.string().optional(),
  link: z.string().optional(),
});

export const detailedChoiceSchema = z.object({
  id: z.string().min(1, 'Choice id is required'),
  title: z.string().min(1, 'Choice title is required'),
  color: z.string().min(1, 'Choice color is required'),
  description: tiptapContentSchema,
  link: z.string().optional(),
});

export const detailedChoiceFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  color: z.string().min(1, 'Color is required'),
  description: tiptapContentSchema,
  link: z.string().optional(),
});

export const pollMetadataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  pollLink: z.string().optional(),
  description: z.string().optional(),
  answerType: z.string().min(1, 'Answer type is required'),
  requestComment: z.boolean(),
});

export const contestMetadataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: tiptapContentSchema,
  link: z.string().optional(),
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
