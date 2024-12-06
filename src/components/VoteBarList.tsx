import { Box, ColorSwatch, Flex, Text, useMantineTheme } from '@mantine/core';
import { BatchVoteFragment } from '../generated/graphql';
import { VoteBar } from './poll/VoteBar';
import { Bold } from './Typography';
import { stringInPercent } from '../utils/units';
import { useMemo } from 'react';

export const VoteBarList = ({
  batchVote,
}: {
  batchVote: BatchVoteFragment;
}) => {
  const theme = useMantineTheme();

  const sortedVotes = useMemo(() => {
    return batchVote.votes.sort((a, b) => b.amount - a.amount);
  }, [batchVote]);

  return sortedVotes.map((vote) => (
    <Box mb="md" key={`${batchVote.id}`}>
      <Flex align={'center'} mb={4}>
        <ColorSwatch color={vote?.choice?.color as string} size={12} mr="8" />
        <VoteBar
          key={vote.id}
          totalVoted={batchVote.totalVoted}
          amount={vote.amount}
          color={vote?.choice?.color as string}
        />
      </Flex>
      <Flex align={'center'} w="100%">
        <Text fz="12px" c={theme.colors.steel[4]} lineClamp={1}>
          <Bold c={theme.colors.steel[2]}>
            {stringInPercent(vote.amount, batchVote.totalVoted)}%
          </Bold>
          {' · '}
          {vote.choice?.title}
        </Text>
      </Flex>
    </Box>
  ));
};
