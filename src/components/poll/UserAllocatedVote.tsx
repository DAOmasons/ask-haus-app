import { Box, Group, Text, useMantineTheme } from '@mantine/core';
import { BatchVoteFragment } from '../../generated/graphql';
import { useEffect, useMemo, useState } from 'react';
import { pastRelativeTimeInSeconds } from '../../utils/time';
import { AddressAvatar } from '../AddressAvatar';
import { Address, formatEther } from 'viem';
import { VoteBar } from './VoteBar';

export const UserAllocatedVote = ({
  totalVoted,
  userBatchVote,
}: {
  totalVoted: string;
  userBatchVote: BatchVoteFragment;
}) => {
  const theme = useMantineTheme();
  const [tick, setTick] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTick(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [tick]);

  const timeDisplay = useMemo(
    () => {
      if (userBatchVote) {
        return `Voted ${pastRelativeTimeInSeconds(userBatchVote?.timestamp as number)} ago`;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userBatchVote, tick]
  );

  return (
    <Box>
      <Group mb="xl" justify="space-between">
        <AddressAvatar address={userBatchVote.voter as Address} canCopy />
        <Text fz="xs" c={theme.colors.steel[4]}>
          {formatEther(userBatchVote.totalVoted)} Points
        </Text>
      </Group>
      <Box mb="md">
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
      <Text fz="xs" c={theme.colors.steel[4]}>
        {timeDisplay}
      </Text>
    </Box>
  );
};
