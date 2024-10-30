import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getPoll } from '../queries/poll';
import { CenterLayout } from '../layout/Layout';
import {
  ActionIcon,
  Box,
  Button,
  ColorSwatch,
  Group,
  Modal,
  Paper,
  Radio,
  SegmentedControl,
  Slider,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { SubTitle, TextLink } from '../components/Typography';
import { useEffect, useMemo, useState } from 'react';
import {
  futureRelativeTimeInSeconds,
  nowInSeconds,
  pastRelativeTimeInSeconds,
  secondsToDate,
} from '../utils/time';
import { AddressAvatar } from '../components/AddressAvatar';
import { Address } from 'viem';
import { IconExternalLink, IconSearch } from '@tabler/icons-react';
import { ChoiceInputType } from '../constants/enum';
import { TxButton } from '../components/TxButton';
import { useAccount } from 'wagmi';
import { useBaalPoints } from '../hooks/useBaalPoints';
import { Display } from '../components/Display';
import { useDisclosure } from '@mantine/hooks';
import { FormChoice } from '../types/ui';

const calculateTotalVotes = (
  entries: Record<string, number>,
  voteType?: string,
  selectedChoice?: string
) => {
  if (voteType === ChoiceInputType.Single) {
    return selectedChoice ? 100 : 0;
  } else if (voteType === ChoiceInputType.Allocate) {
    return Object.values(entries).reduce((acc, cur) => acc + cur, 0);
  } else {
    return 0;
  }
};

export const Poll = () => {
  const { id } = useParams();
  const { address } = useAccount();
  const theme = useMantineTheme();
  const [tick, setTick] = useState(new Date());
  const [entries, setEntries] = useState<Record<string, number>>({});
  const [selectedChoice, setSelectedChoice] = useState<string | undefined>();
  const [modalOpened, { open, close }] = useDisclosure();

  const { data, isLoading, error } = useQuery({
    queryKey: [`poll`, id],
    queryFn: () => getPoll({ pollId: id as string }),
    enabled: !!id,
  });
  const startTime = data?.votesParams?.startTime;
  const endTime = data?.votesParams?.endTime;
  const isUpcoming = startTime > nowInSeconds();
  const isActive = !isUpcoming && endTime > nowInSeconds();

  const { pointsDisplay } = useBaalPoints({
    userAddress: address,
    pointsAddress: data?.pointsAddress,
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

    if (!startTime || !endTime) {
      return null;
    } else if (isUpcoming) {
      return `Starts in ${futureRelativeTimeInSeconds(startTime)}`;
    } else if (isActive) {
      return `Ends in ${futureRelativeTimeInSeconds(endTime)}`;
    } else {
      return `Ended ${pastRelativeTimeInSeconds(endTime)} ago`;
    }
  }, [data, startTime, endTime, isUpcoming, isUpcoming, isActive, tick]);

  const totalAllocated = calculateTotalVotes(
    entries,
    data?.answerType,
    selectedChoice
  );

  const tokenDisplay = useMemo(() => {
    if (!data || (data && !pointsDisplay)) {
      return <Text c={theme.colors.steel[2]} fz="xs" mt="sm"></Text>;
    }
    if (pointsDisplay === '0') {
      return (
        <Text c={theme.colors.steel[2]} fz="xs" mt="sm">
          Your account does not have points to vote with
        </Text>
      );
    }

    return (
      <Text c={theme.colors.steel[2]} fz="xs" mt="sm">
        Your account has {pointsDisplay} points to vote with
      </Text>
    );
  }, [pointsDisplay, data]);

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

  if (error) {
    return <Display title={'Error'} description={error.message} />;
  }

  return (
    <CenterLayout>
      <Box w="100%" maw={500} mb="lg">
        <Group mb="sm" align="start" justify="space-between">
          <SubTitle>Poll</SubTitle>
          <SegmentedControl data={['Vote', 'Results']} size="xs" disabled />
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
              onClick={open}
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
          {data?.answerType === ChoiceInputType.Allocate && (
            <Text c={theme.colors.steel[4]} fz="xs" mb="md">
              Adjust the sliders to distribute your vote
            </Text>
          )}
          {data?.answerType === ChoiceInputType.Single && (
            <Text c={theme.colors.steel[4]} fz="xs" mb="md">
              100% of your voting power will be allocated to that choice
            </Text>
          )}
          {data?.answerType === ChoiceInputType.Allocate && (
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
              {tokenDisplay}
            </Stack>
          )}
          {data?.answerType === ChoiceInputType.Single && (
            <Stack gap={'md'}>
              {data?.choicesParams?.choices.map((c) => (
                <Radio
                  key={c.id}
                  label={c.title}
                  disabled={!isActive}
                  color={c.color as string}
                  checked={selectedChoice === c.id}
                  onChange={() => setSelectedChoice(c.id)}
                />
              ))}
              {tokenDisplay}
            </Stack>
          )}
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
        {isUpcoming && (
          <Display
            title="Voting not started"
            description="This poll was scheduled in advance. Please check back later."
          />
        )}
        {!isUpcoming && !isActive && (
          <Display
            title="Voting has ended"
            description="Please check the results"
          />
        )}
      </Stack>
      <DetailsModal
        opened={modalOpened}
        close={close}
        question={data?.title}
        description={data?.description || undefined}
        pollLink={data?.pollLink || undefined}
        snapshot={data?.pointsParams?.checkpoint}
        choices={data?.choicesParams?.choices as FormChoice[] | undefined}
        startTime={data?.votesParams?.startTime}
        endTime={data?.votesParams?.endTime}
      />
      {isActive && <TxButton disabled={isLoading || totalAllocated !== 100} />}
    </CenterLayout>
  );
};

const DetailsModal = ({
  opened,
  close,
  question,
  endTime,
  startTime,
  description = 'No description provided',
  pollLink,
  snapshot,
  choices,
}: {
  startTime?: number;
  endTime?: number;
  snapshot: string;
  pollLink?: string;
  description?: string;
  question?: string;
  opened: boolean;
  close: () => void;
  choices: FormChoice[] | undefined;
}) => {
  const theme = useMantineTheme();
  const [segment, setSegment] = useState('Poll');

  return (
    <Modal.Root opened={opened} onClose={close} centered lockScroll={false}>
      <Modal.Overlay />
      <Modal.Content miw={300} maw={440} h={425} style={{ overflowY: 'auto' }}>
        <Group w="100%" mb="md">
          <SegmentedControl
            data={['Poll', 'Answers']}
            size="xs"
            value={segment}
            onChange={setSegment}
          />
          <Modal.CloseButton />
        </Group>

        {segment === 'Poll' && (
          <Stack>
            {description && (
              <Box>
                <Text fz={'xs'} mb="4" c={theme.colors.steel[4]}>
                  Poll Description
                </Text>
                <Text fz="sm" c={theme.colors.steel[2]}>
                  {description}
                </Text>
              </Box>
            )}
            {pollLink && (
              <Box>
                <Text fz={'xs'} mb="4" c={theme.colors.steel[4]}>
                  Poll Link
                </Text>
                <Text
                  component="a"
                  fz="sm"
                  href="/create-poll"
                  rel="noopener"
                  target="_blank"
                  c={theme.colors.steel[2]}
                >
                  {pollLink}
                </Text>
              </Box>
            )}
            <Box>
              <Text fz={'xs'} mb="4" c={theme.colors.steel[4]}>
                Snapshot Timestamp
              </Text>
              <Text fz="sm" c={theme.colors.steel[2]}>
                {secondsToDate(Number(snapshot))}
              </Text>
            </Box>
            <Box>
              <Text fz={'xs'} mb="4" c={theme.colors.steel[4]}>
                Start Time
              </Text>
              <Text fz="sm" c={theme.colors.steel[2]}>
                {secondsToDate(Number(startTime))}
              </Text>
            </Box>
            <Box>
              <Text fz={'xs'} mb="4" c={theme.colors.steel[4]}>
                End Time
              </Text>
              <Text fz="sm" c={theme.colors.steel[2]}>
                {secondsToDate(Number(endTime))}
              </Text>
            </Box>
            <Box></Box>
          </Stack>
        )}
        {segment === 'Answers' && (
          <Stack>
            <Text fz={'xs'} c={theme.colors.steel[4]} mb="xs">
              Poll Answers
            </Text>
            {choices?.map((c, i) => (
              <Box key={c.id}>
                <Group gap={4}>
                  <Text fz="sm" c={theme.colors.steel[2]}>
                    {i + 1}) {c.title}
                  </Text>
                  {c.link && (
                    <ActionIcon
                      variant="ghost-icon"
                      component="a"
                      href={c.link}
                      rel="noopener"
                      target="_blank"
                    >
                      <IconExternalLink
                        size={14}
                        color={theme.colors.steel[4]}
                      />
                    </ActionIcon>
                  )}
                </Group>
                {c.description && (
                  <Text fz="xs" c={theme.colors.steel[4]}>
                    {c.description}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </Modal.Content>
    </Modal.Root>
  );
};
