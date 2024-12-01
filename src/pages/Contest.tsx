import {
  Box,
  Button,
  Divider,
  Group,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { CenterLayout } from '../layout/Layout';
import { SectionText, SubTitle } from '../components/Typography';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getContest } from '../queries/contest';
import { Content } from '@tiptap/react';
import { TipTapDisplay } from '../components/TipTapDisplay';
import {
  futureRelativeTimeInSeconds,
  nowInSeconds,
  pastRelativeTimeInSeconds,
} from '../utils/time';
import { ChoiceInputType, VoteStage } from '../constants/enum';
import { AddressAvatar } from '../components/AddressAvatar';
import { Address, formatEther } from 'viem';
import { IconSearch } from '@tabler/icons-react';
import { useBaalPoints } from '../hooks/useBaalPoints';
import { useAccount } from 'wagmi';

export const Contest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { colors } = useMantineTheme();
  const [view, setView] = useState<string | undefined>('Vote');
  const [tick, setTick] = useState(new Date());

  const { data } = useQuery({
    queryKey: ['contest', id],
    queryFn: () => getContest({ contestId: id as string }),
    enabled: !!id,
  });

  const { address } = useAccount();

  const {
    points,
    pointsDisplay,
    isLoading: isLoadingPoints,
  } = useBaalPoints({
    userAddress: address,
    pointsAddress: data?.pointsParams.id,
  });

  console.log('data', data);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);
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
      {view === 'Vote' && !isLoadingPoints && (
        <VotesPanel
          userPoints={points}
          title={data?.title}
          description={data?.description}
          voteStage={voteStage}
          answerType={data?.answerType}
        />
      )}
    </CenterLayout>
  );
};

const VotesPanel = ({
  title,
  description,
  voteStage,
  userPoints,
  answerType,
}: {
  userPoints?: bigint;
  voteStage?: VoteStage;
  title?: string;
  description?: Content;
  answerType?: string;
}) => {
  const { colors } = useMantineTheme();

  return (
    <Stack w="100%" maw={500} mb="lg" gap="lg">
      {voteStage === VoteStage.Upcoming && (
        <Paper>
          <Text c={colors.steel[0]} fw="600" mb="sm">
            Contest is upcoming
          </Text>
          <Text c={colors.steel[2]}></Text>
        </Paper>
      )}
      {voteStage === VoteStage.Populating && (
        <Paper>
          <Text c={colors.steel[0]} fw="600" mb="sm">
            Choices Round is Open
          </Text>
        </Paper>
      )}
      {voteStage === VoteStage.Voting && (
        <Paper>
          <Text c={colors.steel[0]} fw="600" mb="xs">
            Voting Round is Open
          </Text>
          <Text c={colors.steel[2]} fz="sm">
            {!userPoints || userPoints === 0n
              ? 'You do not have points to vote on this contest'
              : answerType === ChoiceInputType.Allocate
                ? `You have ${formatEther(userPoints)} points to distribute across any number of choices.`
                : answerType === ChoiceInputType.Single
                  ? `You have ${formatEther(userPoints)} points to allocate to a single choice.`
                  : 'XXXXX Error XXXXX'}
          </Text>
        </Paper>
      )}
      {voteStage === VoteStage.Past && (
        <Paper>
          <Text c={colors.steel[0]} fw="600" mb="sm">
            Contest is Complete
          </Text>
        </Paper>
      )}
      <Box>
        <SectionText>Contest Details</SectionText>
        <Paper mt="sm">
          <Box mb="md">
            <Text fz="1.5rem" mb="xs" fw={700} c={colors.steel[0]}>
              {title}
            </Text>
            {description && <Divider mb="lg" />}
          </Box>
          {description && <TipTapDisplay content={description} />}
          <Button
            variant="secondary"
            size="xs"
            mt={'xl'}
            leftSection={<IconSearch size={14} />}
          >
            Details
          </Button>
        </Paper>
      </Box>
    </Stack>
  );
};
