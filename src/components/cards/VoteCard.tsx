import {
  ActionIcon,
  Box,
  Flex,
  Group,
  HoverCard,
  Paper,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useMemo } from 'react';
import {
  futureRelativeTimeInSeconds,
  nowInSeconds,
  pastRelativeTimeInSeconds,
} from '../../utils/time';
import { IconLink, IconMessage } from '@tabler/icons-react';
import { AddressAvatar } from '../AddressAvatar';
import { Address } from 'viem';
import { VoteType } from '../../constants/enum';
import paperClasses from '../../styles/paper.module.css';

export const VoteCard = ({
  title,
  startTime,
  endTime,
  duration,
  onClick,
  link,
  postedBy,
  voteType,
  description,
}: {
  title: string;
  startTime: number;
  endTime: number;
  duration: number;
  postedBy: string;
  onClick?: () => void;
  link?: string;
  description?: string;
  voteType: VoteType;
}) => {
  const { colors } = useMantineTheme();

  const timeDisplay = useMemo(() => {
    const isUpcoming = startTime > nowInSeconds();
    const isActive = !isUpcoming && endTime > nowInSeconds();
    if (!startTime || !endTime || !duration) {
      return null;
    } else if (isUpcoming) {
      const time = futureRelativeTimeInSeconds(startTime);
      return `Starts in ${time.d}d ${time.h}h ${time.m}m ${time.s}s`;
    } else if (isActive) {
      const time = futureRelativeTimeInSeconds(endTime);
      return `Ends in ${time.d}d ${time.h}h ${time.m}m ${time.s}s`;
    } else {
      const time = pastRelativeTimeInSeconds(endTime);
      return `Ended ${time.d}d ${time.h}h ${time.m}m ${time.s}s ago`;
    }
  }, [startTime, endTime, duration]);

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
      <Box mb="sm">{<AddressAvatar address={postedBy as Address} />}</Box>
      <Group justify="space-between">
        <Text fz="xs" c={colors.steel[4]}>
          {timeDisplay}
        </Text>
      </Group>
    </Paper>
  );
};
