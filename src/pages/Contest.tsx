import {
  Box,
  Button,
  Divider,
  Group,
  Modal,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { CenterLayout } from '../layout/Layout';
import { SubTitle } from '../components/Typography';
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
  secondsToDate,
} from '../utils/time';
import { ChoiceInputType, VoteStage } from '../constants/enum';
import { AddressAvatar } from '../components/AddressAvatar';
import { Address, formatEther } from 'viem';
import { IconSearch } from '@tabler/icons-react';
import { useBaalPoints } from '../hooks/useBaalPoints';
import { useAccount } from 'wagmi';
import { BasicChoiceFragment } from '../generated/graphql';
import { useDisclosure } from '@mantine/hooks';

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

  const { points, isLoading: isLoadingPoints } = useBaalPoints({
    userAddress: address,
    pointsAddress: data?.pointsParams.id,
  });

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
          holderThreshold={data?.choicesParams?.holderThreshold}
          choices={data?.basicChoices?.choices}
          choiceStartTime={data?.choicesParams?.startTime}
          choiceEndTime={data?.choicesParams?.endTime}
          voteStartTime={data?.votesParams?.startTime}
          voteEndTime={data?.votesParams?.endTime}
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
  holderThreshold,
  choices,
  choiceStartTime,
  choiceEndTime,
  voteStartTime,
  voteEndTime,
}: {
  userPoints?: bigint;
  voteStage?: VoteStage;
  title?: string;
  description?: Content;
  answerType?: string;
  holderThreshold?: bigint;
  choices?: BasicChoiceFragment[];
  choiceStartTime?: number;
  choiceEndTime?: number;
  voteStartTime?: number;
  voteEndTime?: number;
}) => {
  const { colors } = useMantineTheme();
  const [opened, { open, close }] = useDisclosure();

  return (
    <Stack w="100%" maw={500} mb="lg" gap="lg">
      {voteStage === VoteStage.Upcoming && (
        <Paper>
          <Text c={colors.steel[0]} fw="600" mb="sm">
            Contest is upcoming
          </Text>
          <Text c={colors.steel[2]} fz="sm">
            {choiceStartTime &&
              `This contest will start on ${secondsToDate(choiceStartTime)}`}
          </Text>
        </Paper>
      )}
      {voteStage === VoteStage.Populating && (
        <Paper>
          <Text c={colors.steel[0]} fw="600" mb="xs">
            Choices Round is Open
          </Text>
          <Text c={colors.steel[2]} fz="sm">
            {!userPoints || !holderThreshold
              ? ''
              : userPoints < holderThreshold
                ? `This contest requires ${formatEther(holderThreshold)} points to submit a choice. Your points (${formatEther(userPoints)}) are not enough to vote on this contest`
                : `You have enough points (${formatEther(userPoints)}) to vote on this contest`}
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
          <Text c={colors.steel[2]} fz="sm">
            {voteEndTime &&
              `This contest ended on ${secondsToDate(voteEndTime)}`}
          </Text>
        </Paper>
      )}
      <Box>
        <Text c={colors.steel[2]} fz="sm">
          Contest Instructions
        </Text>
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
            mt={'lg'}
            leftSection={<IconSearch size={14} />}
            onClick={open}
          >
            Details
          </Button>
        </Paper>
      </Box>
      <DetailsModal
        opened={opened}
        close={close}
        voteStage={voteStage}
        choiceStartTime={choiceStartTime}
        choiceEndTime={choiceEndTime}
        voteStartTime={voteStartTime}
        voteEndTime={voteEndTime}
      />
    </Stack>
  );
};

export const DetailsModal = ({
  opened,
  close,
  choiceStartTime,
  choiceEndTime,
  voteStartTime,
  voteEndTime,
  voteStage,
  snapshot,
  answerType,
  holderThreshold,
}: {
  opened: boolean;
  close: () => void;
  choiceStartTime?: number;
  choiceEndTime?: number;
  voteStartTime?: number;
  voteEndTime?: number;
  snapshot?: string;
  answerType?: string;
  holderThreshold?: bigint;
  voteStage?: VoteStage;
}) => {
  const { colors } = useMantineTheme();
  return (
    <Modal.Root opened={opened} onClose={close} centered lockScroll={false}>
      <Modal.Overlay />
      <Modal.Content miw={300} maw={440} h={425} style={{ overflowY: 'auto' }}>
        <Group w="100%" justify="space-between">
          <Modal.Title>Contest Details</Modal.Title>
          <Modal.CloseButton onClick={close} />
        </Group>
        <Stack mt={'sm'}>
          {voteStage && (
            <Box>
              <Text fz="xs" mb="4" c={colors.steel[2]}>
                Current Stage
              </Text>
              <Text fz="sm" c={colors.steel[0]}>
                {voteStage}
              </Text>
            </Box>
          )}
          {choiceStartTime && (
            <Box>
              <Text fz="xs" mb="4" c={colors.steel[2]}>
                Choice Round Starts
              </Text>
              <Text fz="sm" c={colors.steel[0]}>
                {secondsToDate(choiceStartTime)}
              </Text>
            </Box>
          )}
          {}
          {snapshot && (
            <Box>
              <Text fz="xs" mb="4" c={colors.steel[2]}>
                Contest Snapshot
              </Text>
              <Text fz="sm" c={colors.steel[0]}>
                {snapshot}
              </Text>
            </Box>
          )}
        </Stack>
      </Modal.Content>
    </Modal.Root>
  );
};
