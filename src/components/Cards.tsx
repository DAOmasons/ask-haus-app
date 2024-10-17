import {
  ActionIcon,
  Avatar,
  Box,
  Flex,
  Group,
  HoverCard,
  Paper,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { Icon, IconLink, IconMessage } from '@tabler/icons-react';
import paperClasses from '../styles/paper.module.css';
import { futureRelativeTimeInSeconds } from '../utils/time';
import { useMemo } from 'react';
import { FormChoice } from './form/ChoiceRepeater';

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

export const VoteCard = ({
  title,
  time,
  onClick,
  choices,
  link,
  description,
}: {
  title: string;
  time: string;
  onClick?: () => void;
  choices: FormChoice[];
  link?: string;
  description?: string;
}) => {
  const { colors } = useMantineTheme();

  const timeDisplay = useMemo(() => {
    if (!time) {
      return null;
    } else {
      const futureTime = futureRelativeTimeInSeconds(Number(time));

      return `Ends in ${futureTime.d > 0 ? `${futureTime.d}d` : ''} ${futureTime.h > 0 ? `${futureTime.h}h` : ''} ${futureTime.m > 0 ? `${futureTime.m}m` : ''} ${futureTime.s > 0 ? `${futureTime.s}s` : ''}`;
    }
  }, [time]);

  return (
    <Paper
      p="md"
      classNames={{ root: onClick ? paperClasses.clickable : undefined }}
    >
      <Flex align="start">
        <Text fw={500} c={colors.steel[0]} mb="sm" style={{ flex: 1 }}>
          {title}
        </Text>
        <Group gap={0}>
          {link && (
            <ActionIcon
              radius={999}
              component="a"
              href={link}
              target="_blank"
              rel="noreferrer"
              variant="ghost-icon"
            >
              <IconLink size={16} color={colors.steel[4]} />
            </ActionIcon>
          )}
          {description && (
            <HoverCard openDelay={200} closeDelay={300}>
              <HoverCard.Target>
                <ActionIcon
                  radius={999}
                  onClick={() => {}}
                  variant="ghost-icon"
                  style={{ cursor: 'default' }}
                >
                  <IconMessage size={16} color={colors.steel[4]} />
                </ActionIcon>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Text fz="sm">{description}</Text>
              </HoverCard.Dropdown>
            </HoverCard>
          )}
        </Group>
      </Flex>
      <Group gap={'xs'} mb="sm">
        <Avatar src={''} size={28} bg={colors.steel[5]} />
        <Text c={colors.steel[4]}>jord.eth</Text>
      </Group>
      <Group justify="space-between">
        <Text fz="xs" c={colors.steel[4]}>
          {timeDisplay}
        </Text>
        <Group gap={4}>
          <Text fz={'xs'} c={colors.steel[4]}>
            {choices?.length} Choice{choices?.length !== 1 ? 's' : ''}
          </Text>
          <Avatar.Group>
            {choices?.map((choice) => (
              <Avatar key={choice.id} src={''} size={20} bg={choice.color}>
                <Box />
              </Avatar>
            ))}
          </Avatar.Group>
        </Group>
      </Group>
    </Paper>
  );
};
