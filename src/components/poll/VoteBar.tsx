import { Box, ColorSwatch, Group, Text } from '@mantine/core';
import { stringInPercent } from '../../utils/units';

export const VoteBar = ({
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
    <Box mb="xs">
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
