import {
  Box,
  Button,
  ColorPicker,
  ColorSwatch,
  Divider,
  Group,
  HoverCard,
  InputLabel,
  Paper,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { ChoiceInputType, VoteStage } from '../../constants/enum';
import { BasicChoiceFragment } from '../../generated/graphql';
import { secondsToDate } from '../../utils/time';
import {
  Address,
  encodeAbiParameters,
  formatEther,
  parseAbiParameters,
} from 'viem';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { SectionText } from '../Typography';
import { TipTapDisplay } from '../TipTapDisplay';
import { IconExternalLink, IconSearch } from '@tabler/icons-react';
import { TxButton } from '../TxButton';
import { DetailsModal } from './DetailsModal';
import { Content } from '@tiptap/react';
import { useForm } from '@mantine/form';
import { emptyContent } from '../../utils/tiptapUtils';
import { TextBoss } from '../TextBoss';
import { useTx } from '../../hooks/useTx';
import BaalGateAbi from '../../abi/BaalGate.json';
import { generateRandomBytes32 } from '../../utils/helpers';
import { detailedChoiceSchema } from '../../schema/form/create';
import { notifications } from '@mantine/notifications';

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
}: {
  userPoints?: bigint;
  voteStage?: VoteStage;
  title?: string;
  description?: Content;
  answerType?: string;
  choiceAddress?: string;
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
}) => {
  const { colors } = useMantineTheme();
  const [opened, { open, close }] = useDisclosure();
  const navigate = useNavigate();

  const canSubmitChoice =
    !!userPoints && !!holderThreshold && userPoints >= holderThreshold;

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
                : `You have enough points (${formatEther(userPoints)}) to create a choice for this contest`}
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
        <SectionText>Contest Instructions</SectionText>
        <Paper mt="sm">
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
                onClick={() => {
                  navigate(contestLink);
                }}
              />
            )}
          </Group>
        </Paper>
      </Box>
      <SectionText>Choices</SectionText>
      {choices?.length === 0 && (
        <Paper variant="secondary">
          <Text c={colors.steel[2]} fz="sm">
            Choices have not been submitted yet
          </Text>
        </Paper>
      )}
      {voteStage === VoteStage.Populating && canSubmitChoice && (
        <ChoiceCreate choiceAddress={choiceAddress} />
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

const ChoiceCreate = ({ choiceAddress }: { choiceAddress?: string }) => {
  const { tx } = useTx();

  const form = useForm({
    initialValues: {
      title: '',
      description: emptyContent,
      link: '',
      color: '',
    },
  });

  const handleChoiceCreate = async () => {
    if (!choiceAddress) {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Choice address not found',
      });
      return;
    }
    const choiceId = generateRandomBytes32();

    const validated = detailedChoiceSchema.safeParse({
      id: choiceId,
      ...form.values,
    });

    if (!validated.success) {
      notifications.show({
        color: 'red',
        title: 'Validation Error',
        message: 'Please check your choice data',
      });
      return;
    }

    const data = encodeAbiParameters(
      parseAbiParameters('bytes, (uint256,string)'),
      ['0x', [6969420n, JSON.stringify(validated.data)]]
    );

    tx({
      writeContractParams: {
        abi: BaalGateAbi,
        address: choiceAddress as Address,
        functionName: 'registerChoice',
        args: [choiceId, data],
      },
    });
  };

  return (
    <>
      <SectionText>Create Choice</SectionText>
      <Paper>
        <Stack>
          <Group align="center">
            <InputLabel h={18} required>
              Choice Color
            </InputLabel>
            <HoverCard openDelay={200} closeDelay={300}>
              <HoverCard.Target>
                <ColorSwatch color={form.values.color} />
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <ColorPicker
                  value={form.values.color}
                  onChange={(color) => form.setFieldValue('color', color)}
                />
              </HoverCard.Dropdown>
            </HoverCard>
          </Group>
          <TextInput
            label="Choice Title"
            placeholder="Name for your choice"
            description="There must be at least two choices"
            required
            {...form.getInputProps('title')}
          />
          <TextBoss
            label="Choice Description"
            placeholder="Write your description here"
            required
            {...form.getInputProps('description')}
          />
          <TextInput
            label="Choice Link"
            placeholder="https://example.com"
            {...form.getInputProps('link')}
          />
        </Stack>
      </Paper>

      <Group justify="center">
        <TxButton onClick={handleChoiceCreate}>Create Choice</TxButton>
      </Group>
    </>
  );
};
