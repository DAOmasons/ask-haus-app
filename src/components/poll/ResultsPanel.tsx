import {
  Box,
  ColorSwatch,
  Group,
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
import { VoteBar } from './VoteBar';
import { TotalResults } from './TotalResults';
import { UserAllocatedVote } from './UserAllocatedVote';

export const ResultsPanel = ({
  isActive,
  isUpcoming,
  isComplete,
  batchVotes,
  choices,
  hasVoted,
  totalVoted,
}: {
  isComplete: boolean;
  totalVoted?: string;
  isActive: boolean;
  isUpcoming: boolean;
  batchVotes: BatchVoteFragment[];
  choices?: BasicChoiceFragment[];
  hasVoted?: boolean;
}) => {
  const [topSection, setTopSection] = useState<string | null>('Results');

  const { address } = useAccount();
  const theme = useMantineTheme();

  const userBatchVote = useMemo(() => {
    if (!hasVoted || !address || !batchVotes) return null;
    return batchVotes?.find((vote) => vote.voter === address);
  }, [batchVotes, address, hasVoted]);

  const topDisplay = useMemo(() => {
    if (isUpcoming)
      return (
        <Paper>
          <Text c={theme.colors.steel[0]} fw="600" mb="sm">
            Poll is upcoming
          </Text>
          <Text c={theme.colors.steel[4]}>This poll isn't open yet</Text>
        </Paper>
      );
    if (isActive)
      return (
        <Paper>
          <Text c={theme.colors.steel[0]} fw="600" mb="sm">
            Poll is active
          </Text>
          <Text c={theme.colors.steel[4]}>
            {hasVoted
              ? 'You have voted on this poll'
              : 'You have not voted on this poll'}
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
              ? 'You voted on this poll'
              : 'You did not vote on this poll'}
          </Text>
        </Paper>
      );
  }, [isUpcoming, isActive, isComplete, hasVoted, theme.colors]);

  return (
    <Stack w="100%" maw={500} gap={'xl'} mb="xl">
      {topDisplay}
      <Paper>
        <Select
          data={hasVoted ? ['Results', 'Your Vote'] : ['Results']}
          value={topSection}
          onChange={(value) => setTopSection(value)}
          mb="sm"
        />
        <Text c={theme.colors.steel[2]} mb="lg" fz="sm">
          {topSection === 'Results'
            ? `${batchVotes?.length} voter${batchVotes?.length > 1 ? 's' : ''}, ${totalVoted ? formatEther(BigInt(totalVoted || '0')) + ' points voted' : ''}`
            : `Your Distribution`}
        </Text>

        {topSection === 'Results' && batchVotes?.length > 0 && (
          <TotalResults
            choices={choices}
            totalVoted={totalVoted}
            batchVotes={batchVotes}
          />
        )}
        {userBatchVote && topSection === 'Your Vote' && (
          <YourVote
            userBatchVote={userBatchVote}
            totalVoted={totalVoted as string}
          />
        )}

        <Text fz="xs" mb="sm">
          Legend
        </Text>
        {choices && batchVotes?.length > 0 ? (
          <Box>
            {choices.map((choice) => {
              return (
                <Box key={choice.id} mb="sm">
                  <Group mb={8} gap={'xs'}>
                    <ColorSwatch color={choice.color as string} size={16} />
                    <Text fw={500}>{choice.title}</Text>
                  </Group>
                  {/* {choice.description && (
                    <Box mb={8}>
                      <Text fz="xs" c={theme.colors.steel[4]}>
                        Description
                      </Text>
                      <Text fz="sm" c={theme.colors.steel[2]}>
                        {choice.description}
                      </Text>
                    </Box>
                  )}
                  {choice.link && (
                    <Box mb={8}>
                      <Text fz="xs" c={theme.colors.steel[4]}>
                        Link
                      </Text>
                      <Text
                        fz="sm"
                        component="a"
                        href={choice.link}
                        c={theme.colors.steel[2]}
                        lineClamp={1}
                      >
                        {choice.link}
                      </Text>
                    </Box>
                  )} */}
                </Box>
              );
            })}
          </Box>
        ) : (
          <Text fz="sm" c={theme.colors.steel[4]}>
            No votes yet
          </Text>
        )}
      </Paper>
      <Box>
        <SectionText mb="lg">All Votes</SectionText>
        {totalVoted &&
          batchVotes &&
          batchVotes?.length > 0 &&
          batchVotes.map((bv) => (
            <Paper>
              <UserAllocatedVote totalVoted={totalVoted} userBatchVote={bv} />
            </Paper>
          ))}
      </Box>
    </Stack>
  );
};

const YourVote = ({
  totalVoted,
  userBatchVote,
}: {
  totalVoted: string;
  userBatchVote: BatchVoteFragment;
}) => {
  return (
    <Box mb="lg">
      <Box>
        <Text fz="xs" mb="sm">
          Your Vote
        </Text>
        {userBatchVote?.votes.map((vote) => {
          return (
            <VoteBar
              key={vote.id}
              totalVoted={totalVoted}
              amount={vote.amount}
              color={vote?.choice?.color as string}
            />
          );
        })}
      </Box>
    </Box>
  );
};
