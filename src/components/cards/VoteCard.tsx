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
import { useEffect, useMemo, useState } from 'react';
import {
  futureRelativeTimeInSeconds,
  nowInSeconds,
  pastRelativeTimeInSeconds,
} from '../../utils/time';
import {
  IconChartBar,
  IconLink,
  IconMessage,
  IconTrophy,
} from '@tabler/icons-react';
import { AddressAvatar } from '../AddressAvatar';
import { Address } from 'viem';
import { VoteType } from '../../constants/enum';
import paperClasses from '../../styles/paper.module.css';
import { useNavigate } from 'react-router-dom';

export const VoteCard = ({
  title,
  startTime,
  endTime,
  duration,
  pollLink,
  postedBy,
  to,
  voteType,
  description,
  tick = true,
}: {
  title: string;
  startTime: number;
  endTime: number;
  to?: string;
  duration: number;
  postedBy: string;
  pollLink?: string;
  description?: string;
  voteType: VoteType;
  tick?: boolean;
}) => {
  const [tickTime, setTickTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTickTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [tick]);

  const { colors } = useMantineTheme();

  const timeDisplay = useMemo(() => {
    const isUpcoming = startTime > nowInSeconds();
    const isActive = !isUpcoming && endTime > nowInSeconds();
    if (!startTime || !endTime || !duration) {
      return null;
    } else if (isUpcoming) {
      return `Starts in ${futureRelativeTimeInSeconds(startTime)}`;
    } else if (isActive) {
      return `Ends in ${futureRelativeTimeInSeconds(endTime)}`;
    } else {
      return `Ended ${pastRelativeTimeInSeconds(endTime)} ago`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime, duration, tickTime]);

  const voteTypeDisplay = useMemo(() => {
    if (voteType === VoteType.Poll) {
      return (
        <Group gap="xs">
          <IconChartBar size={14} color={colors.steel[4]} />
          <Text c={colors.steel[4]} fz="xs">
            Poll
          </Text>
        </Group>
      );
    }
    if (voteType === VoteType.Contest) {
      return (
        <Group gap="xs">
          <IconTrophy size={14} color={colors.steel[4]} />
          <Text c={colors.steel[4]} fz="xs">
            Contest
          </Text>
        </Group>
      );
    }
  }, [voteType, colors.steel]);

  const handleCardNavigate = () => {
    if (to) {
      navigate(to);
    }
  };

  return (
    <Paper
      p="md"
      onClick={to ? handleCardNavigate : undefined}
      classNames={{ root: to ? paperClasses.clickable : undefined }}
    >
      <Flex align="start">
        <Text fw={500} c={colors.steel[0]} mb="sm" style={{ flex: 1 }}>
          {title}
        </Text>
        <Group gap={4}>
          {pollLink && (
            <ActionIcon
              radius={999}
              component="a"
              href={pollLink}
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
        {voteTypeDisplay}
      </Group>
    </Paper>
  );
};
