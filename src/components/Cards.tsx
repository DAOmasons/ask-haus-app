import { Flex, Paper, Text, useMantineTheme } from '@mantine/core';
import { Icon } from '@tabler/icons-react';
import paperClasses from '../styles/paper.module.css';

export const VoteType = ({
  Icon,
  title,
  onClick,
}: {
  Icon: Icon;
  title: string;
  onClick?: () => void;
}) => {
  const { colors } = useMantineTheme();
  return (
    <Paper onClick={onClick} classNames={{ root: paperClasses.clickable }}>
      <Flex align="center" direction="column" justify="center" h={100} w={200}>
        <Icon size={60} color={colors.steel[0]} />
        <Text c={colors.steel[0]}>{title}</Text>
      </Flex>
    </Paper>
  );
};
