import { Flex, Paper, Text, useMantineTheme } from '@mantine/core';

export const Display = ({
  title,
  description,
  h = 80,
}: {
  h?: number;
  title: string;
  description?: string;
}) => {
  const { colors } = useMantineTheme();
  return (
    <Paper w="100%">
      <Flex h={h} justify="center" align="center" direction="column">
        <Text fw={600} mb="sm" c={colors.steel[0]}>
          {title}
        </Text>
        <Text fz={'sm'} c={colors.steel[4]}>
          {description}
        </Text>
      </Flex>
    </Paper>
  );
};
