import { Box, ColorSwatch, Flex, Text, useMantineTheme } from '@mantine/core';
import {
  BasicChoiceFragment,
  BatchVoteFragment,
} from '../../generated/graphql';
import { VoteBar } from './VoteBar';
import { Bold } from '../Typography';
import { stringInPercent } from '../../utils/units';
import { useMemo } from 'react';

export const TotalResults = ({
  choices,
  totalVoted,
  batchVotes,
}: {
  choices?: BasicChoiceFragment[];
  totalVoted?: string;
  batchVotes?: BatchVoteFragment[];
}) => {
  const theme = useMantineTheme();
  const sortedChoice = useMemo(() => {
    if (!choices) return;

    return choices?.sort((a, b) => b.amountVoted - a.amountVoted);
  }, [choices]);
  if (!choices || !batchVotes || !totalVoted || !sortedChoice) return null;

  return sortedChoice.map((choice) => {
    return (
      <Box mb="md">
        <Flex align={'center'} mb={4}>
          <ColorSwatch color={choice.color as string} size={12} mr="8" />
          <VoteBar
            key={choice.id}
            totalVoted={totalVoted}
            amount={choice.amountVoted}
            color={choice.color as string}
          />
        </Flex>
        <Flex align={'center'} w="100%">
          <Text fz="12px" c={theme.colors.steel[4]} lineClamp={1}>
            <Bold c={theme.colors.steel[2]}>
              {stringInPercent(choice.amountVoted, totalVoted)}%
            </Bold>
            {' · '}
            {choice?.title}
          </Text>
        </Flex>
      </Box>
    );
  });
};
