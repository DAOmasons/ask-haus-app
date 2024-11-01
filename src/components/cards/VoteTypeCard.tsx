import { Flex, Paper, Text, Tooltip, useMantineTheme } from '@mantine/core';
import { Icon } from '@tabler/icons-react';
import paperClasses from '../../styles/paper.module.css';

export const VoteTypeCard = ({
  Icon,
  title,
  onClick,
  underConstruction,
}: {
  Icon: Icon;
  title: string;
  onClick?: () => void;
  underConstruction?: boolean;
}) => {
  const { colors } = useMantineTheme();

  if (underConstruction) {
    return (
      <Tooltip label="Under Construction">
        <Paper onClick={onClick}>
          <Flex
            align="center"
            direction="column"
            justify="center"
            h={125}
            w={250}
          >
            <Icon size={48} color={colors.steel[4]} />
            <Text c={colors.steel[4]} mt="xs" fz="sm">
              {title}
            </Text>
          </Flex>
        </Paper>
      </Tooltip>
    );
  }

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
