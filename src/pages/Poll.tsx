import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getPoll } from '../queries/poll';
import { CenterLayout } from '../layout/Layout';
import {
  Box,
  Group,
  SegmentedControl,
  Text,
  Tooltip,
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
import { Address, encodeAbiParameters, parseAbiParameters } from 'viem';
import { ChoiceInputType } from '../constants/enum';
import { useAccount } from 'wagmi';
import { useBaalPoints } from '../hooks/useBaalPoints';
import { Display } from '../components/Display';
import { useDisclosure } from '@mantine/hooks';

import { useTx } from '../hooks/useTx';
import { notifications } from '@mantine/notifications';
import ContestAbi from '../abi/Contest.json';
import { getSolPercentages } from '../utils/units';
import { VotePanel } from '../components/poll/VotePanel';
import { DetailsModal } from '../components/poll/DetailsModal';
import { ResultsPanel } from '../components/poll/ResultsPanel';
import { IconCheck, IconExclamationCircle } from '@tabler/icons-react';

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
  const [view, setView] = useState('Vote');
  const [tick, setTick] = useState(new Date());
  const [entries, setEntries] = useState<Record<string, number>>({});
  const [selectedChoice, setSelectedChoice] = useState<string | undefined>();
  const [modalOpened, { open, close }] = useDisclosure();
  const { tx } = useTx();

  const {
    data,
    isLoading: isLoadingPoll,
    error,
  } = useQuery({
    queryKey: [`poll`, id],
    queryFn: () => getPoll({ pollId: id as string }),
    enabled: !!id,
  });

  const startTime = data?.votesParams?.startTime;
  const endTime = data?.votesParams?.endTime;
  const isUpcoming = startTime > nowInSeconds();
  const isActive = !isUpcoming && endTime > nowInSeconds();
  const isComplete = !isUpcoming && !isActive;

  const {
    points,
    pointsDisplay,
    isLoading: isLoadingPoints,
  } = useBaalPoints({
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, startTime, endTime, isUpcoming, isUpcoming, isActive, tick]);

  const totalAllocated = calculateTotalVotes(
    entries,
    data?.answerType,
    selectedChoice
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

  if (isLoadingPoll) {
    return null;
  }

  if (error) {
    return <Display title={'Error'} description={error.message} />;
  }

  const hasVoted = data?.round?.batchVotes?.some(
    (batch) => batch.voter === address
  );

  const handleVote = async () => {
    const choicesWithValues = Object.entries(entries).filter(
      ([, value]) => value > 0
    );

    const percents = choicesWithValues.map(([, value]) => value);

    const emptyMetadata = [0n, ''] as const;

    const totalPercents = percents.reduce((acc, cur) => acc + cur, 0);

    if (
      totalPercents !== 100 &&
      data?.answerType === ChoiceInputType.Allocate
    ) {
      notifications.show({
        title: 'Error',
        message: 'Total percentage must be 100',
        color: 'red',
      });
      return;
    }

    if (points === 0n) {
      notifications.show({
        title: 'Error',
        message: 'You need points to vote',
        color: 'red',
      });
      return;
    }

    let choiceIds: string[] = [];
    let amounts: bigint[] = [];
    let sum = 0n;
    let encodedEmptyMetadata: string[] = [];

    if (data?.answerType === ChoiceInputType.Allocate) {
      amounts = getSolPercentages(percents, points as bigint);
      encodedEmptyMetadata = amounts.map(() =>
        encodeAbiParameters(parseAbiParameters('(uint256, string)'), [
          emptyMetadata,
        ])
      );
      sum = amounts.reduce((acc, curr) => acc + curr, 0n);
      choiceIds = choicesWithValues.map(([id]) => id);
    } else if (data?.answerType === ChoiceInputType.Single) {
      if (!selectedChoice) {
        notifications.show({
          title: 'Error',
          message: 'Please select a choice',
          color: 'red',
        });
        return;
      }
      choiceIds = [selectedChoice];
      amounts = [points as bigint];
      encodedEmptyMetadata = [
        encodeAbiParameters(parseAbiParameters('(uint256, string)'), [
          emptyMetadata,
        ]),
      ];
      sum = points as bigint;
    } else {
      notifications.show({
        title: 'Error',
        message: 'Answer type not found',
        color: 'red',
      });
      return;
    }

    if (sum !== points) {
      console.error('sum', sum);
      notifications.show({
        title: 'Error',
        message: 'Total amount must be equal to points',
        color: 'red',
      });
      return;
    }

    try {
      tx({
        writeContractParams: {
          abi: ContestAbi,
          functionName: 'batchVote',
          args: [
            choiceIds,
            amounts,
            encodedEmptyMetadata,
            sum,
            [999999999n, ''],
          ],
          address: data?.round_id as Address,
        },
        writeContractOptions: {
          onPollSuccess() {
            notifications.show({
              title: 'Success',
              message: 'Your vote has been submitted',
              color: 'green',
            });
          },
        },
      });
    } catch (error: any) {
      console.error(error);
      notifications.show({
        title: 'Error',
        message: error?.message || 'Something went wrong',
        color: 'red',
      });
    }
  };

  return (
    <CenterLayout>
      <Box w="100%" maw={500} mb="lg">
        <Group mb="sm" align="start" justify="space-between">
          {
            <Group>
              <SubTitle>Poll</SubTitle>
              {hasVoted && (
                <Tooltip label="You have voted on this poll">
                  <IconCheck size={16} color={theme.colors.steel[4]} />
                </Tooltip>
              )}
              {isComplete && !hasVoted && (
                <Tooltip label="You did not vote on this poll">
                  <IconExclamationCircle
                    size={16}
                    color={theme.colors.steel[4]}
                  />
                </Tooltip>
              )}
            </Group>
          }
          <SegmentedControl
            data={['Vote', 'Results']}
            value={view}
            onChange={setView}
            size="xs"
          />
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
      {view === 'Vote' && (
        <VotePanel
          title={data?.title || ''}
          open={open}
          pollLink={data?.pollLink || undefined}
          answerType={data?.answerType}
          choices={data?.choicesParams?.choices}
          pointsDisplay={pointsDisplay}
          entries={entries}
          handleSliderChange={handleSliderChange}
          isActive={isActive}
          selectedChoice={selectedChoice}
          setSelectedChoice={setSelectedChoice}
          totalAllocated={totalAllocated}
          isUpcoming={isUpcoming}
          handleVote={handleVote}
          isLoading={isLoadingPoll}
          hasVoted={hasVoted}
        />
      )}
      {view === 'Results' && (
        <ResultsPanel
          isComplete={isComplete}
          isActive={isActive}
          isUpcoming={isUpcoming}
          batchVotes={data?.round?.batchVotes || []}
          choices={data?.choicesParams?.choices || []}
          hasVoted={hasVoted}
          totalVoted={data?.round?.totalVoted}
        />
      )}
      <DetailsModal
        opened={modalOpened}
        close={close}
        question={data?.title}
        description={data?.description || undefined}
        pollLink={data?.pollLink || undefined}
        snapshot={data?.pointsParams?.checkpoint}
        choices={data?.choicesParams?.choices}
        startTime={data?.votesParams?.startTime}
        endTime={data?.votesParams?.endTime}
      />
    </CenterLayout>
  );
};
