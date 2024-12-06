import { Address, formatEther } from 'viem';
import { useEffect, useMemo, useState } from 'react';
import { Box, Group, Paper, Text, useMantineTheme } from '@mantine/core';

import { BatchVoteFragment } from '../../generated/graphql';
import { pastRelativeTimeInSeconds } from '../../utils/time';
import { AddressAvatar } from '../AddressAvatar';
import { VoteBarList } from '../VoteBarList';

export const UserAllocatedVote = ({
  userBatchVote,
}: {
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
    <Paper>
      <Group mb="xl" justify="space-between">
        <AddressAvatar address={userBatchVote.voter as Address} canCopy />
        <Text fz="xs" c={theme.colors.steel[4]}>
          {formatEther(userBatchVote.totalVoted)} Points
        </Text>
      </Group>
      <VoteBarList batchVote={userBatchVote} />
      <Text fz="xs" c={theme.colors.steel[4]}>
        {timeDisplay}
      </Text>
    </Paper>
  );
};
