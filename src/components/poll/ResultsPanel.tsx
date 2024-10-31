import { Paper, Stack, Text, useMantineTheme } from '@mantine/core';
import { useAccount } from 'wagmi';
import { BasicVoteFragment } from '../../generated/graphql';

export const ResultsPanel = ({
  isActive,
  isUpcoming,
  votes,
}: {
  isActive: boolean;
  isUpcoming: boolean;
  votes: BasicVoteFragment[];
}) => {
  const hasEnded = !isActive && !isUpcoming;
  const { address } = useAccount();
  const theme = useMantineTheme();
  const hasVoted = address;

  return (
    <Stack w="100%" maw={500} gap={'xl'} mb="xl">
      <Paper>
        <Text c={theme.colors.steel[0]} fw="600" mb="sm">
          Completed
        </Text>
        <Text c={theme.colors.steel[4]}>You have voted on this poll</Text>
      </Paper>
      <Paper></Paper>
    </Stack>
  );
};
