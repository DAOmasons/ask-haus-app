import { ADDR } from '../constants/address';
import { VoteStage, VoteType } from '../constants/enum';
import { PollCardFragment } from '../generated/graphql';
import { sdk } from '../utils/indexer';

export type FrontPagePollsType = {
  activePolls: PollCardFragment[];
  pastPolls: PollCardFragment[];
  upcomingPolls: PollCardFragment[];
};

export type VoteCardType = {
  id: string;
  to: string;
  title: string;
  postedBy: string;
  startTime: number;
  endTime: number;
  duration: number;
  description?: string;
  pollLink?: string;
  voteType: VoteType;
  voteStage?: VoteStage;
};

export const getFrontPageVotes = async () => {
  try {
    const now = Math.floor(Date.now() / 1000);

    const data = await sdk.frontPageVotes({
      now,
      dao: ADDR.DAO,
    });

    const notablePolls = [
      ...(data?.activePolls || []),
      ...(data?.upcomingPolls || []),
    ];

    const notableContests = [
      ...(data?.votingContests?.map((contest) => ({
        ...contest,
        voteStage: VoteStage.Voting,
      })) || []),
      ...(data?.populatingContests?.map((contest) => ({
        ...contest,
        voteStage: VoteStage.Populating,
      })) || []),
      ...(data?.upcomingContests?.map((contest) => ({
        ...contest,
        voteStage: undefined,
      })) || []),
    ];

    const processedNotablePolls = notablePolls.map((poll) => {
      return {
        id: poll.id,
        to: `/poll/${poll.id}`,
        title: poll.title,
        postedBy: poll.postedBy,
        startTime: poll.votesParams?.startTime,
        endTime: poll.votesParams?.endTime,
        duration: poll.votesParams?.duration,
        description: poll.description || undefined,
        pollLink: poll.pollLink || undefined,
        voteType: VoteType.Poll,
      };
    });

    const processedNotableContests = notableContests.map((contest) => {
      return {
        id: contest.id,
        to: `/contest/${contest.id}`,
        title: contest.title,
        postedBy: contest.postedBy,
        startTime: contest.votesParams?.startTime,
        endTime: contest.votesParams?.endTime,
        duration: contest.votesParams?.duration,
        description: contest.description || undefined,
        pollLink: contest.pollLink || undefined,
        voteType: VoteType.Contest,
        voteStage: contest.voteStage,
      };
    });

    const pastPolls = data?.pastPolls.map((poll) => {
      return {
        id: poll.id,
        to: `/poll/${poll.id}`,
        title: poll.title,
        postedBy: poll.postedBy,
        startTime: poll.votesParams?.startTime,
        endTime: poll.votesParams?.endTime,
        duration: poll.votesParams?.duration,
        description: poll.description || undefined,
        pollLink: poll.pollLink || undefined,
        voteType: VoteType.Poll,
      };
    });

    const pastContests = data?.pastContests.map((contest) => {
      return {
        id: contest.id,
        to: `/contest/${contest.id}`,
        title: contest.title,
        postedBy: contest.postedBy,
        startTime: contest.votesParams?.startTime,
        endTime: contest.votesParams?.endTime,
        duration: contest.votesParams?.duration,
        description: contest.description || undefined,
        pollLink: contest.pollLink || undefined,
        voteType: VoteType.Contest,
      };
    });

    return {
      active: [...processedNotableContests, ...processedNotablePolls]
        .sort((a, b) => b.startTime - a.startTime)
        .slice(0, 5) as VoteCardType[],
      past: [...pastPolls, ...pastContests]
        .sort((a, b) => b.startTime - a.startTime)
        .slice(0, 5) as VoteCardType[],
    };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch front page polls');
  }
};
