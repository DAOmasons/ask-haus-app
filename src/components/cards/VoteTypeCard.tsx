import { Flex, Paper, Text, Tooltip, useMantineTheme } from '@mantine/core';
import { Icon } from '@tabler/icons-react';
import paperClasses from '../../styles/paper.module.css';
import { useMobile, useTablet } from '../../hooks/useBreakpoint';

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
  const isTablet = useTablet();
  const isMobile = useMobile() || isTablet;

  if (underConstruction) {
    return (
      <Tooltip label="Under Construction">
        <Paper onClick={onClick}>
          <Flex
            align="center"
            direction="column"
            justify="center"
            style={{
              aspectRatio: isMobile ? '1 / 1' : '8 / 5',
            }}
            h={isMobile ? '65' : 125}
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
      <Flex
        align="center"
        direction="column"
        justify="center"
        style={{
          aspectRatio: isMobile ? '1 / 1' : '8 / 5',
        }}
        h={isMobile ? 65 : 125}
      >
        <Icon size={48} color={colors.steel[0]} />
        <Text c={colors.steel[0]} mt="xs" fz="sm">
          {title}
        </Text>
      </Flex>
    </Paper>
  );
};
