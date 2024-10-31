import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getPoll } from '../queries/poll';
import { CenterLayout } from '../layout/Layout';
import {
  Box,
  Group,
  SegmentedControl,
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

  const { data, isLoading, error } = useQuery({
    queryKey: [`poll`, id],
    queryFn: () => getPoll({ pollId: id as string }),
    enabled: !!id,
  });

  const startTime = data?.votesParams?.startTime;
  const endTime = data?.votesParams?.endTime;
  const isUpcoming = startTime > nowInSeconds();
  const isActive = !isUpcoming && endTime > nowInSeconds();

  const { points, pointsDisplay } = useBaalPoints({
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

  if (isLoading) {
    return null;
  }

  if (error) {
    return <Display title={'Error'} description={error.message} />;
  }

  const handleVote = async () => {
    const choicesWithValues = Object.entries(entries).filter(
      ([, value]) => value > 0
    );

    const choiceIds = choicesWithValues.map(([id]) => id);
    const percents = choicesWithValues.map(([, value]) => value);

    const emptyMetadata = [0n, ''] as const;

    const totalPercents = percents.reduce((acc, cur) => acc + cur, 0);
    if (totalPercents !== 100) {
      console.error('totalPercents', totalPercents);
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

    const amounts = getSolPercentages(percents, points as bigint);

    const encodedEmptyMetadata = amounts.map(() =>
      encodeAbiParameters(parseAbiParameters('(uint256, string)'), [
        emptyMetadata,
      ])
    );

    const sum = amounts.reduce((acc, curr) => acc + curr, 0n);
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
          <SubTitle>Poll</SubTitle>
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
          isLoading={isLoading}
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
