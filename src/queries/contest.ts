import { sdk } from '../utils/indexer';
import { Content } from '@tiptap/core';

export const getContest = async ({ contestId }: { contestId: string }) => {
  try {
    const data = await sdk.getContest({ contestId: contestId });
    if (!data?.AskHausContest_by_pk) {
      throw new Error('Contest not found');
    }

    const contest = data.AskHausContest_by_pk;
    const { description, choicesParams, votesParams } = contest;
    return {
      ...contest,
      description: description
        ? (JSON.parse(description as string) as Content)
        : undefined,
      choicesParams: {
        ...choicesParams,
        startTime: Number(choicesParams?.startTime),
        endTime: Number(choicesParams?.endTime),
        holderThreshold: BigInt(choicesParams?.holderThreshold),
      },
      votesParams: {
        ...votesParams,
        startTime: Number(votesParams?.startTime),
        endTime: Number(votesParams?.endTime),
        duration: Number(votesParams?.duration),
      },
      pointsParams: {
        ...contest.pointsParams,
        checkpoint: Number(contest.pointsParams?.checkpoint),
        holderType: Number(contest.pointsParams?.holderType),
      },
    };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch contest');
  }
};
