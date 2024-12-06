import {
  Box,
  Paper,
  Select,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useAccount } from 'wagmi';
import {
  BasicChoiceFragment,
  BatchVoteFragment,
} from '../../generated/graphql';
import { useMemo, useState } from 'react';
import { formatEther } from 'viem';
import { SectionText } from '../Typography';
import { TotalResults } from './TotalResults';
import { UserAllocatedVote } from './UserAllocatedVote';
import { VoteType } from '../../constants/enum';
import { VoteBarList } from '../VoteBarList';

export const ResultsPanel = ({
  isActive,
  isUpcoming,
  isComplete,
  batchVotes,
  choices,
  hasVoted,
  totalVoted,
  voteType,
}: {
  isComplete: boolean;
  totalVoted?: string;
  isActive: boolean;
  isUpcoming: boolean;
  batchVotes: BatchVoteFragment[];
  choices?: BasicChoiceFragment[];
  hasVoted?: boolean;
  voteType: VoteType;
}) => {
  const [topSection, setTopSection] = useState<string | null>('Total');

  const { address } = useAccount();
  const theme = useMantineTheme();

  const userBatchVote = useMemo(() => {
    if (!hasVoted || !address || !batchVotes) return null;
    return batchVotes?.find((vote) => vote.voter === address);
  }, [batchVotes, address, hasVoted]);

  const voteTypeName = useMemo(() => {
    return voteType === VoteType.Poll
      ? ['Poll', 'poll']
      : voteType === VoteType.Contest
        ? ['Contest', 'contest']
        : ['Session', 'session'];
  }, [voteType]);

  const topDisplay = useMemo(() => {
    if (isUpcoming)
      return (
        <Paper>
          <Text c={theme.colors.steel[0]} fw="600" mb="sm">
            {voteTypeName[0]} is upcoming
          </Text>
          <Text c={theme.colors.steel[4]}>
            This {voteTypeName[1]} isn't open yet
          </Text>
        </Paper>
      );
    if (isActive)
      return (
        <Paper>
          <Text c={theme.colors.steel[0]} fw="600" mb="sm">
            {voteTypeName[0]} is active
          </Text>
          <Text c={theme.colors.steel[4]}>
            {hasVoted
              ? `You have voted on this ${voteTypeName[1]}`
              : `You have not voted on this ${voteTypeName[1]}`}
          </Text>
        </Paper>
      );
    if (isComplete)
      return (
        <Paper>
          <Text c={theme.colors.steel[0]} fw="600" mb="sm">
            Completed
          </Text>
          <Text c={theme.colors.steel[4]}>
            {hasVoted
              ? `You voted on this ${voteTypeName[1]}`
              : `You did not vote on this ${voteTypeName[1]}`}
          </Text>
        </Paper>
      );
  }, [isUpcoming, isActive, isComplete, hasVoted, theme.colors, voteTypeName]);

  return (
    <Stack w="100%" maw={500} gap={'xl'} mb="xl">
      {topDisplay}
      <Paper>
        <Select
          data={hasVoted ? ['Total', 'Your Vote'] : ['Total']}
          value={topSection}
          onChange={(value) => setTopSection(value)}
          mb="lg"
        />

        {topSection === 'Total' && batchVotes?.length > 0 && (
          <Paper style={{ border: `1px dashed ${theme.colors.dark[4]}` }}>
            <Text c={theme.colors.steel[2]} mb="md" fw={600}>
              Total Vote Results
            </Text>
            <TotalResults
              choices={choices}
              totalVoted={totalVoted}
              batchVotes={batchVotes}
            />
          </Paper>
        )}
        {userBatchVote && topSection === 'Your Vote' && (
          <Paper style={{ border: `1px dashed ${theme.colors.dark[4]}` }}>
            <Text c={theme.colors.steel[2]} mb="md" fw={600}>
              Your Vote
            </Text>
            <VoteBarList batchVote={userBatchVote} />
          </Paper>
        )}
        <Text c={theme.colors.steel[2]} fz="sm" mt="lg">
          {topSection === 'Total'
            ? `${batchVotes?.length} voter${batchVotes?.length > 1 ? 's' : ''}, ${totalVoted ? formatEther(BigInt(totalVoted || '0')) + ' points voted' : ''}`
            : `Your Distribution`}
        </Text>
      </Paper>
      <Box>
        <SectionText mb="lg">All Votes</SectionText>
        {totalVoted && batchVotes && batchVotes?.length > 0 && (
          <Stack gap={'lg'}>
            {batchVotes.map((bv) => (
              <UserAllocatedVote userBatchVote={bv} />
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
};
