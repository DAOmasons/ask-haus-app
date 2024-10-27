import { Flex, Paper, Text, useMantineTheme } from '@mantine/core';
import { Icon } from '@tabler/icons-react';
import paperClasses from '../../styles/paper.module.css';

export const VoteTypeCard = ({
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
      <Flex align="center" direction="column" justify="center" h={125} w={250}>
        <Icon size={48} color={colors.steel[0]} />
        <Text c={colors.steel[0]} mt="xs" fz="sm">
          {title}
        </Text>
      </Flex>
    </Paper>
  );
};
