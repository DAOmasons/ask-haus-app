import { ADDR } from '../constants/address';
import { PollCardFragment } from '../generated/graphql';
import { sdk } from '../utils/indexer';

export type FrontPagePollsType = {
  activePolls: PollCardFragment[];
  pastPolls: PollCardFragment[];
  upcomingPolls: PollCardFragment[];
};

export const getPoll = async ({ pollId }: { pollId: string }) => {
  try {
    const data = await sdk.getPoll({ pollId });

    if (!data?.AskHausPoll_by_pk) {
      throw new Error('Poll not found');
    }

    return data.AskHausPoll_by_pk;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch poll');
  }
};

export const getActivePolls = async () => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const data = await sdk.livePolls({ now, dao: ADDR.DAO });

    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch active polls');
  }
};
