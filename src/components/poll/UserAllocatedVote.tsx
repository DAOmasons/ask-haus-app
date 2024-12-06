import {
  Box,
  ColorSwatch,
  Flex,
  Group,
  Paper,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { BatchVoteFragment } from '../../generated/graphql';
import { useEffect, useMemo, useState } from 'react';
import { pastRelativeTimeInSeconds } from '../../utils/time';
import { AddressAvatar } from '../AddressAvatar';
import { Address, formatEther } from 'viem';
import { VoteBar } from './VoteBar';
import { Bold } from '../Typography';
import { stringInPercent } from '../../utils/units';

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

  const totalVoted = useMemo(() => {
    return userBatchVote?.totalVoted;
  }, [userBatchVote]);

  return (
    <Paper>
      <Group mb="xl" justify="space-between">
        <AddressAvatar address={userBatchVote.voter as Address} canCopy />
        <Text fz="xs" c={theme.colors.steel[4]}>
          {formatEther(userBatchVote.totalVoted)} Points
        </Text>
      </Group>
      <Box mb="md">
        {userBatchVote?.votes.map((vote) => {
          return (
            <Box mb="sm">
              <Flex align={'center'} mb={4}>
                <ColorSwatch
                  color={vote?.choice?.color as string}
                  size={12}
                  mr="8"
                />
                <VoteBar
                  key={vote.id}
                  totalVoted={totalVoted}
                  amount={vote.amount}
                  color={vote?.choice?.color as string}
                />
              </Flex>
              <Flex align={'center'} w="100%">
                <Text fz="12px" c={theme.colors.steel[4]} lineClamp={1}>
                  <Bold c={theme.colors.steel[2]}>
                    {stringInPercent(vote.amount, totalVoted)}%
                  </Bold>
                  {' · '}
                  {vote.choice?.title}
                </Text>
              </Flex>
            </Box>
          );
        })}
      </Box>
      <Text fz="xs" c={theme.colors.steel[4]}>
        {timeDisplay}
      </Text>
    </Paper>
  );
};
