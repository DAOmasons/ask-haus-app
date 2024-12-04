import {
  Box,
  Group,
  SegmentedControl,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { CenterLayout } from '../layout/Layout';
import { SubTitle } from '../components/Typography';
import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getContest } from '../queries/contest';
import {
  futureRelativeTimeInSeconds,
  nowInSeconds,
  pastRelativeTimeInSeconds,
} from '../utils/time';
import { VoteStage, VoteType } from '../constants/enum';
import { AddressAvatar } from '../components/AddressAvatar';
import { Address } from 'viem';
import { useBaalPoints } from '../hooks/useBaalPoints';
import { useAccount } from 'wagmi';
import { VotesPanel } from '../components/contest/VotePanel';
import { ResultsPanel } from '../components/poll/ResultsPanel';

export const Contest = () => {
  const { id } = useParams();
  const { colors } = useMantineTheme();
  const [view, setView] = useState<string | undefined>();
  const [tick, setTick] = useState(new Date());

  const { data, refetch: refetchContest } = useQuery({
    queryKey: ['contest', id],
    queryFn: () => getContest({ contestId: id as string }),
    enabled: !!id,
  });

  const { address } = useAccount();

  const { points, isLoading: isLoadingPoints } = useBaalPoints({
    userAddress: address,
    pointsAddress: data?.pointsParams.id,
  });

  const hasVoted = data?.round?.batchVotes?.some(
    (batch) => batch.voter === address
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTick(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if ((data || points != null) && !view) {
      setView(hasVoted ? 'Results' : 'Vote');
    }
  }, [data, points, hasVoted, view]);

  const { timeDisplay, voteStage } = useMemo(() => {
    if (!data) {
      return {
        timeDisplay: undefined,
        voteStage: undefined,
      };
    }

    const now = nowInSeconds();

    if (data?.choicesParams?.startTime > now) {
      return {
        timeDisplay: `Choices Round start in ${futureRelativeTimeInSeconds(data?.choicesParams?.startTime)}`,
        voteStage: VoteStage.Upcoming,
      };
    }
    if (
      data?.choicesParams?.startTime < now &&
      data?.choicesParams?.endTime > now
    ) {
      return {
        timeDisplay: `Choice Round Ends in ${futureRelativeTimeInSeconds(data?.choicesParams?.endTime)}`,
        voteStage: VoteStage.Populating,
      };
    }
    if (
      data?.votesParams?.startTime < now &&
      data?.votesParams?.endTime > now
    ) {
      return {
        timeDisplay: `Votes Round ends in ${futureRelativeTimeInSeconds(data?.votesParams?.endTime)}`,
        voteStage: VoteStage.Voting,
      };
    }
    if (data?.votesParams?.endTime < now) {
      return {
        timeDisplay: `Contest ended ${pastRelativeTimeInSeconds(data?.votesParams?.endTime)} ago`,
        voteStage: VoteStage.Past,
      };
    }
    return {
      timeDisplay: undefined,
      voteStage: undefined,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, tick]);

  return (
    <CenterLayout>
      <Box w="100%" maw={500}>
        <Group mb="lg" align="center" justify="space-between">
          <Group gap="xs">
            <SubTitle>Contest</SubTitle>
          </Group>
          <SegmentedControl
            data={['Vote', 'Results']}
            size="xs"
            onChange={setView}
            value={view}
          />
        </Group>
        <Group justify="space-between" mb="lg">
          <Text c={colors.steel[2]} fz="sm">
            {timeDisplay}
          </Text>
          {data?.postedBy && (
            <AddressAvatar
              size={20}
              fz={'sm'}
              gap={'xs'}
              address={data.postedBy as Address}
            />
          )}
        </Group>
      </Box>
      {data && view === 'Vote' && !isLoadingPoints && (
        <VotesPanel
          userPoints={points}
          title={data?.title}
          description={data?.description}
          voteStage={voteStage}
          answerType={data?.answerType}
          holderThreshold={data?.choicesParams?.holderThreshold}
          choices={data?.basicChoices?.choices}
          choiceStartTime={data?.choicesParams?.startTime}
          choiceEndTime={data?.choicesParams?.endTime}
          refetch={refetchContest}
          voteStartTime={data?.votesParams?.startTime}
          voteEndTime={data?.votesParams?.endTime}
          snapshot={data?.pointsParams.checkpoint}
          voteToken={data?.pointsParams.holderType}
          choiceToken={data?.choicesParams?.holderType}
          contestLink={data?.link || undefined}
          choiceAddress={data?.choicesParams?.id}
          roundAddress={data?.round_id}
          hasVoted={hasVoted}
        />
      )}
      {data && view === 'Results' && (
        <ResultsPanel
          isActive={voteStage === VoteStage.Voting}
          isComplete={voteStage === VoteStage.Past}
          isUpcoming={
            voteStage === VoteStage.Upcoming ||
            voteStage === VoteStage.Populating
          }
          batchVotes={data?.round?.batchVotes || []}
          choices={data?.basicChoices?.choices || []}
          hasVoted={hasVoted}
          totalVoted={data?.round?.totalVoted}
          voteType={VoteType.Contest}
        />
      )}
    </CenterLayout>
  );
};
