import { ADDR } from '../constants/address';
import { VoteStage, VoteType } from '../constants/enum';
import { sdk } from '../utils/indexer';
import { VoteCardType } from './frontPage';

export const getPastRounds = async () => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const data = await sdk.pastRounds({ now, dao: ADDR.DAO });

    const polls = data.pastPolls.map((poll) => ({
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
    }));

    const contests = data.pastContests.map((contest) => ({
      id: contest.id,
      to: `/contest/${contest.id}`,
      title: contest.title,
      postedBy: contest.postedBy,
      startTime: contest.votesParams?.startTime,
      endTime: contest.votesParams?.endTime,
      duration: contest.votesParams?.duration,
      description: contest.description || undefined,
      pollLink: contest.link || undefined,
      voteType: VoteType.Contest,
    }));

    return [...polls, ...contests].sort((a, b) => b.startTime - a.startTime);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch past polls');
  }
};

export const getActiveRounds = async () => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const data = await sdk.liveRounds({ now, dao: ADDR.DAO });

    const liveContests = [
      ...(data?.votingContests.map((contest) => ({
        id: contest.id,
        to: `/contest/${contest.id}`,
        title: contest.title,
        postedBy: contest.postedBy,
        startTime: contest.votesParams?.startTime,
        endTime: contest.votesParams?.endTime,
        duration: contest.votesParams?.duration,
        description: contest.description,
        pollLink: contest.link,
        voteType: VoteType.Contest,
        voteStage: VoteStage.Voting,
      })) || []),
      ...(data?.populatingContests?.map((contest) => ({
        id: contest.id,
        to: `/contest/${contest.id}`,
        title: contest.title,
        postedBy: contest.postedBy,
        startTime: contest.choicesParams?.startTime,
        endTime: contest.choicesParams?.endTime,
        duration: contest.votesParams?.duration,
        description: contest.description,
        pollLink: contest.link,
        voteType: VoteType.Contest,
        voteStage: VoteStage.Populating,
      })) || []),
      ...(data?.upcomingContests?.map((contest) => ({
        id: contest.id,
        to: `/contest/${contest.id}`,
        title: contest.title,
        postedBy: contest.postedBy,
        startTime: contest.choicesParams?.startTime,
        endTime: contest.choicesParams?.endTime,
        duration: contest.votesParams?.duration,
        description: contest.description,
        pollLink: contest.link,
        voteType: VoteType.Contest,
        voteStage: VoteStage.Populating,
      })) || []),
    ] as VoteCardType[];

    const livePolls = [
      ...(data?.activePolls || []),
      ...(data?.upcomingPolls || []),
    ].map((poll) => ({
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
    }));

    return [...liveContests, ...livePolls].sort(
      (a, b) => b.startTime - a.startTime
    );
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch active polls');
  }
};
