import {
  Box,
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { ChoiceInputType, VoteStage } from '../../constants/enum';
import { BasicChoiceFragment } from '../../generated/graphql';
import { secondsToDate } from '../../utils/time';
import { formatEther } from 'viem';
import { useDisclosure } from '@mantine/hooks';
import { TipTapDisplay } from '../TipTapDisplay';
import { IconExternalLink, IconSearch } from '@tabler/icons-react';
import { DetailsModal } from './DetailsModal';
import { Content } from '@tiptap/react';
import { ChoiceCreate } from './ChoiceCreate';
import { ChoiceList } from './ChoiceList';
import { VoteSlider } from './VoteSlider';
import { Display } from '../Display';

export const VotesPanel = ({
  title,
  description,
  voteStage,
  userPoints,
  contestLink,
  answerType,
  holderThreshold,
  choiceAddress,
  choices,
  snapshot,
  choiceStartTime,
  choiceEndTime,
  voteStartTime,
  voteEndTime,
  voteToken,
  choiceToken,
  refetch,
  hasVoted,
  roundAddress,
}: {
  userPoints?: bigint;
  voteStage?: VoteStage;
  title?: string;
  description?: Content;
  answerType?: string;
  choiceAddress?: string;
  roundAddress?: string;
  holderThreshold?: bigint;
  choices?: BasicChoiceFragment[];
  choiceStartTime?: number;
  choiceEndTime?: number;
  voteStartTime?: number;
  voteEndTime?: number;
  snapshot?: number;
  voteToken?: number;
  choiceToken?: number;
  contestLink?: string;
  refetch?: () => void;
  hasVoted?: boolean;
}) => {
  const { colors } = useMantineTheme();
  const [opened, { open, close }] = useDisclosure();

  const canSubmitChoice =
    !!userPoints && !!holderThreshold && userPoints >= holderThreshold;

  return (
    <Stack w="100%" maw={500} mb="lg" gap="lg">
      <Paper>
        <Box mb="md">
          <Text fz="1.5rem" mb="xs" fw={700} c={colors.steel[0]}>
            {title}
          </Text>
          {description && <Divider mb="lg" />}
        </Box>
        {description && <TipTapDisplay content={description} />}
        <Group mt={'lg'}>
          <Button
            variant="secondary"
            size="xs"
            leftSection={<IconSearch size={14} />}
            onClick={open}
          >
            Details
          </Button>
          {contestLink && (
            <Button
              variant="secondary"
              size="xs"
              leftSection={<IconExternalLink size={14} />}
              component="a"
              href={contestLink}
              target="_blank"
              rel="noreferrer"
            >
              Contest Link
            </Button>
          )}
        </Group>
      </Paper>
      {voteStage === VoteStage.Upcoming && (
        <Paper variant="secondary">
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
        <Paper variant="secondary">
          <Text c={colors.steel[0]} fw="600" mb="xs">
            Choices Round is Open
          </Text>
          <Text c={colors.steel[2]} fz="sm">
            {!userPoints || !holderThreshold
              ? ''
              : userPoints < holderThreshold
                ? `This contest requires ${formatEther(holderThreshold)} points to submit a choice. Your points (${formatEther(userPoints)}) are not enough to vote on this contest`
                : `You have enough points (${formatEther(userPoints)}) to create a choice for this contest`}
          </Text>
        </Paper>
      )}
      {voteStage === VoteStage.Voting && (
        <Paper variant="secondary">
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
        <Paper variant="secondary">
          <Text c={colors.steel[0]} fw="600" mb="sm">
            Contest is Complete
          </Text>
          <Text c={colors.steel[2]} fz="sm">
            {voteEndTime &&
              `This contest ended on ${secondsToDate(voteEndTime)}`}
          </Text>
        </Paper>
      )}

      <ChoiceList choices={choices} />
      {voteStage === VoteStage.Past && (
        <Display
          title="Voting has ended"
          description="Please check the results"
        />
      )}
      {voteStage === VoteStage.Voting && hasVoted && (
        <Display
          title="You have voted"
          description="Please check the results"
        />
      )}
      {!hasVoted && voteStage === VoteStage.Voting && answerType && (
        <VoteSlider
          choices={choices}
          answerType={answerType}
          isActive
          refetch={refetch}
          userPoints={userPoints}
          roundAddress={roundAddress}
          userPointsDisplay={userPoints ? formatEther(userPoints) : undefined}
        />
      )}
      {voteStage === VoteStage.Populating && canSubmitChoice && (
        <ChoiceCreate choiceAddress={choiceAddress} refetch={refetch} />
      )}
      <DetailsModal
        opened={opened}
        close={close}
        voteStage={voteStage}
        choiceStartTime={choiceStartTime}
        choiceEndTime={choiceEndTime}
        voteStartTime={voteStartTime}
        voteEndTime={voteEndTime}
        answerType={answerType}
        holderThreshold={holderThreshold}
        snapshot={snapshot}
        voteToken={voteToken}
        choiceToken={choiceToken}
      />
    </Stack>
  );
};
