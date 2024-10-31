import {
  BackgroundImage,
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
  BasicVoteFragment,
  BatchVoteFragment,
} from '../../generated/graphql';
import { useMemo, useState } from 'react';
import { charLimit } from '../../utils/helpers';
import { formatEther } from 'viem';
import { stringInPercent } from '../../utils/units';

export const ResultsPanel = ({
  isActive,
  isUpcoming,
  batchVotes,
  choices,
  hasVoted,
  totalVoted,
}: {
  totalVoted?: string;
  isActive: boolean;
  isUpcoming: boolean;
  batchVotes: BatchVoteFragment[];
  choices?: BasicChoiceFragment[];
  hasVoted?: boolean;
}) => {
  const [topSection, setTopSection] = useState<string | null>('Results');
  const hasEnded = !isActive && !isUpcoming;
  const { address } = useAccount();
  const theme = useMantineTheme();

  const userBatchVote = useMemo(() => {
    if (!hasVoted || !address || !batchVotes) return null;
    return batchVotes?.find((vote) => vote.voter === address);
  }, [batchVotes, address, hasVoted]);

  return (
    <Stack w="100%" maw={500} gap={'xl'} mb="xl">
      <Paper>
        <Text c={theme.colors.steel[0]} fw="600" mb="sm">
          Completed
        </Text>
        <Text c={theme.colors.steel[4]}>You have voted on this poll</Text>
      </Paper>
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
                  {choice.description && (
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
                      >
                        {charLimit(choice.link, 56)}
                      </Text>
                    </Box>
                  )}
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

const TotalResults = ({
  choices,
  totalVoted,
  batchVotes,
}: {
  choices?: BasicChoiceFragment[];
  totalVoted?: string;
  batchVotes?: BatchVoteFragment[];
}) => {
  if (!choices || !batchVotes || !totalVoted) return null;
  return (
    <Box mb="lg">
      <Box>
        <Text fz="xs" mb="sm">
          Results
        </Text>
        {choices?.map((choice) => {
          return (
            <VoteBar
              key={choice.id}
              totalVoted={totalVoted}
              amount={choice.amountVoted}
              color={choice.color as string}
            />
          );
        })}
      </Box>
    </Box>
  );
};

const VoteBar = ({
  totalVoted,
  amount,
  color,
}: {
  totalVoted: string;
  color: string;
  amount: string;
}) => {
  const percentage = stringInPercent(amount, totalVoted);
  return (
    <Box mb="sm">
      <Group mb="6" gap={8}>
        <ColorSwatch color={color} size={12} />
        <Group w="95%">
          <Box
            w={`${percentage}%`}
            h={8}
            bg={color as string}
            style={{
              borderBottomRightRadius: 4,
              borderTopRightRadius: 4,
            }}
          />
        </Group>
      </Group>
      <Text fz="xs">{percentage}%</Text>
    </Box>
  );
};
