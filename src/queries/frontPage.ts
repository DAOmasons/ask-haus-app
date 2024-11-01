import { ADDR } from '../constants/address';
import { PollCardFragment } from '../generated/graphql';
import { sdk } from '../utils/indexer';

export type FrontPagePollsType = {
  activePolls: PollCardFragment[];
  pastPolls: PollCardFragment[];
  upcomingPolls: PollCardFragment[];
};

export const frontPagePolls = async () => {
  try {
    const now = Math.floor(Date.now() / 1000);

    const data = await sdk.frontPagePolls({
      now,
      dao: ADDR.DAO,
    });

    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch front page polls');
  }
};
