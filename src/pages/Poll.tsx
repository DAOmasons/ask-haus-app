import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getPoll } from '../queries/poll';
import { CenterLayout } from '../layout/Layout';
import {
  Box,
  Button,
  ColorSwatch,
  Group,
  Paper,
  SegmentedControl,
  Slider,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { SubTitle } from '../components/Typography';
import { useEffect, useMemo, useState } from 'react';
import {
  futureRelativeTimeInSeconds,
  nowInSeconds,
  pastRelativeTimeInSeconds,
} from '../utils/time';
import { AddressAvatar } from '../components/AddressAvatar';
import { Address } from 'viem';
import { IconExternalLink, IconSearch } from '@tabler/icons-react';

export const Poll = () => {
  const { id } = useParams();
  const theme = useMantineTheme();
  const [tick, setTick] = useState(new Date());
  const [entries, setEntries] = useState<Record<string, number>>({});

  const { data, isLoading, error } = useQuery({
    queryKey: [`poll`, id],
    queryFn: () => getPoll({ pollId: id as string }),
    enabled: !!id,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTick(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [tick]);

  const timeDisplay = useMemo(() => {
    if (!data) {
      return '';
    }

    const startTime = data?.votesParams?.startTime;
    const endTime = data?.votesParams?.endTime;
    const isUpcoming = startTime > nowInSeconds();
    const isActive = !isUpcoming && endTime > nowInSeconds();

    if (!startTime || !endTime) {
      return null;
    } else if (isUpcoming) {
      return `Starts in ${futureRelativeTimeInSeconds(startTime)}`;
    } else if (isActive) {
      return `Ends in ${futureRelativeTimeInSeconds(endTime)}`;
    } else {
      return `Ended ${pastRelativeTimeInSeconds(endTime)} ago`;
    }
  }, [data, tick]);

  const totalAllocated = Object.values(entries).reduce(
    (sum, item) => sum + item,
    0
  );

  const handleSliderChange = (id: string, newValue: number) => {
    const otherValuesTotal = Object.entries(entries).reduce(
      (sum, [entryId, value]) => (id !== entryId ? sum + value : sum),
      0
    );

    const maxAllowed = 100 - otherValuesTotal;

    const clampedValue = Math.min(newValue, maxAllowed);

    setEntries((prevValues) => ({ ...prevValues, [id]: clampedValue }));
  };

  if (isLoading) {
    return null;
  }

  return (
    <CenterLayout>
      <Box w="100%" maw={500} mb="lg">
        <Group mb="sm" align="start" justify="space-between">
          <SubTitle>Poll</SubTitle>
          <SegmentedControl data={['Vote', 'Results']} size="xs" />
        </Group>
        <Group justify="space-between">
          <Text c={theme.colors.steel[2]} fz="sm">
            {timeDisplay}
          </Text>
          <AddressAvatar
            size={20}
            fz={'sm'}
            gap={'xs'}
            address={data?.postedBy as Address}
          />
        </Group>
      </Box>
      <Stack w="100%" maw={500} gap={'xl'} mb="xl">
        <Paper>
          <Group mb="sm" gap="0">
            <Text fw={600} c={theme.colors.steel[0]} mr={'sm'}>
              Question
            </Text>
          </Group>
          <Text c={theme.colors.steel[4]} mb={'md'}>
            {data?.title}
          </Text>
          <Group gap="sm">
            <Button
              size="xs"
              variant="secondary"
              leftSection={<IconSearch size={14} />}
            >
              Details
            </Button>
            <Button
              size="xs"
              variant="secondary"
              leftSection={<IconExternalLink size={14} />}
            >
              Poll Link
            </Button>
          </Group>
        </Paper>
        <Paper>
          <Text fw={600} c={theme.colors.steel[0]} mb="2px">
            Answer
          </Text>
          <Text c={theme.colors.steel[4]} fz="xs" mb="md">
            Adjust the sliders to distribute your vote
          </Text>
          <Stack gap={'xl'}>
            {data?.choicesParams?.choices.map((c) => {
              const currentValue = entries[c.id] || 0;
              return (
                <Box>
                  <Group mb="xs" align="start" gap={'xs'}>
                    <ColorSwatch
                      color={c.color as string}
                      size={16}
                      style={{ transform: 'translateY(2.5px)' }}
                    />
                    <Text fw={500}>{c.title}</Text>
                  </Group>
                  <Group gap={0}>
                    <Text w={'10%'} fz="sm">
                      {currentValue || 0}%
                    </Text>
                    <Box w="90%">
                      <Slider
                        label={`${c.title} (${currentValue}%)`}
                        max={100}
                        min={0}
                        color={c.color as string}
                        value={currentValue}
                        onChange={(value) => handleSliderChange(c.id, value)}
                      />
                    </Box>
                  </Group>
                </Box>
              );
            })}
          </Stack>
        </Paper>
        <Paper>
          <Box>
            <Text fw={400} c={theme.colors.steel[2]} mb="xs" fz="sm">
              Total allocated: {totalAllocated}%
            </Text>
            <Text c={theme.colors.steel[2]} fz="sm">
              Remaining: {100 - totalAllocated}%
            </Text>
          </Box>
        </Paper>
      </Stack>
      <Button>Submit</Button>
    </CenterLayout>
  );
};
