import { Box, Flex, Group, Text, useMantineTheme } from '@mantine/core';
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
  const theme = useMantineTheme();
  const percentage = stringInPercent(amount, totalVoted);
  return (
    <Box w="100%">
      <Flex w="100%">
        {/* <Text fz="xs" w="10%" c={theme.colors.steel[0]} fw={600}>
          {percentage}%
        </Text> */}
        <Group w="90%">
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
      </Flex>
    </Box>
  );
};
