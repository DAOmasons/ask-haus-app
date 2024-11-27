import { sdk } from '../utils/indexer';

export const getContest = async ({ contestId }: { contestId: string }) => {
  try {
    const data = await sdk.getContest({ contestId: contestId });
    if (!data?.AskHausContest_by_pk) {
      throw new Error('Contest not found');
    }
    return {
      ...data.AskHausContest_by_pk,
      description: JSON.parse(data.AskHausContest_by_pk.description),
    };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch contest');
  }
};
