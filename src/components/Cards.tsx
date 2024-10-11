import {
  Avatar,
  Flex,
  Group,
  Paper,
  Text,
  useMantineTheme,
} from '@mantine/core';
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
      <Flex align="center" direction="column" justify="center" h={125} w={250}>
        <Icon size={48} color={colors.steel[0]} />
        <Text c={colors.steel[0]} mt="xs" fz="sm">
          {title}
        </Text>
      </Flex>
    </Paper>
  );
};

export const VoteCard = ({ title }: { title: string }) => {
  const { colors } = useMantineTheme();
  return (
    <Paper p="md" classNames={{ root: paperClasses.clickable }}>
      <Text fw={500} c={colors.steel[0]} mb="sm">
        {title}
      </Text>
      <Group gap={'xs'} mb="sm">
        <Avatar src={''} size={28} bg={colors.steel[5]} />
        <Text c={colors.steel[4]}>jord.eth</Text>
      </Group>
      <Text fz="sm" c={colors.steel[4]}>
        Ends in 4d 8h 32s
      </Text>
    </Paper>
  );
};
