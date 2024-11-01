import { Box, Text } from '@mantine/core';
import {
  BasicChoiceFragment,
  BatchVoteFragment,
} from '../../generated/graphql';
import { VoteBar } from './VoteBar';

export const TotalResults = ({
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
