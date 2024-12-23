import { CenterLayout } from '../layout/Layout';
import {
  Box,
  Button,
  Group,
  InputLabel,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { Bold, SubTitle } from '../components/Typography';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useTx } from '../hooks/useTx';
import { useState } from 'react';
import { TextBoss } from '../components/TextBoss';
import { nowInSeconds, Times } from '../utils/time';
import { TxButton } from '../components/TxButton';
import { IconArrowLeft, IconArrowRight, IconCopy } from '@tabler/icons-react';
import { ChoiceInputType, HolderType } from '../constants/enum';
import globalClasses from '../styles/global.module.css';
import { useForm, zodResolver } from '@mantine/form';
import {
  createContestSchema1,
  createContestSchema2,
  CreateContest1Values,
  CreateContest2Values,
} from '../schema/form/create';
import { emptyContent } from '../utils/tiptapUtils';
import factory from '../abi/FastFactory.json';
import { ADDR } from '../constants/address';
import { createContestArgs } from '../utils/factory';
import { useClipboard } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

export const CreateContest = () => {
  const { tx } = useTx();
  const navigate = useNavigate();
  const location = useLocation();
  const formIndex = location.pathname.split('/').slice(-1)[0];
  const [contestTag, setContestTag] = useState<string | undefined>();

  const nextForm = () => {
    navigate(`${Number(formIndex) + 1}`);
  };

  const step1Form = useForm({
    initialValues: {
      title: '',
      description: emptyContent,
      link: '',
    },
    validateInputOnBlur: true,
    validate: zodResolver(createContestSchema1),
  });

  const step2Form = useForm({
    initialValues: {
      choiceTime: 'Three Days',
      customChoiceStart: new Date(),
      customChoiceTimeEnd: new Date(
        new Date().setDate(new Date().getDate() + 7)
      ),
      choiceTokenType: 'Both',
      choiceTokenAmount: 10,
      votingTime: 'Three Days',
      voteTokenType: 'Both',
      customVoteStart: new Date(new Date().setDate(new Date().getDate() + 7)),
      customVoteEnd: new Date(new Date().setDate(new Date().getDate() + 14)),
      answerType: 'Allocation (%)',
    },
    validateInputOnBlur: true,
    validate: zodResolver(createContestSchema2),
  });

  const handleSubmit = async () => {
    const choiceStartTime = 0;

    const choiceDuration =
      Times[step2Form.values.choiceTime as unknown as keyof typeof Times];

    const voteStartTime = nowInSeconds() + choiceDuration;

    const voteDuration =
      Times[step2Form.values.votingTime as unknown as keyof typeof Times];

    const { args, filterTag } = await createContestArgs({
      metadata: {
        title: step1Form.values.title,
        description: step1Form.values.description,
        link: step1Form.values.link,
        answerType: step2Form.values.answerType,
        contentType: 'onchain',
        requestComment: false,
      },
      timedVoteArgs: {
        startTime: voteStartTime,
        duration: voteDuration,
        autostart: true,
      },
      baalChoicesArgs: {
        daoAddress: ADDR.DAO,
        startTime: choiceStartTime,
        duration: choiceDuration,
        holderType:
          step2Form.values.choiceTokenType === 'Both'
            ? HolderType.Both
            : step2Form.values.choiceTokenType === 'Shares'
              ? HolderType.Share
              : step2Form.values.choiceTokenType === 'Loot'
                ? HolderType.Loot
                : HolderType.None,
        holderThreshold: step2Form.values.choiceTokenAmount,
      },
      pointsArgs: {
        holderType:
          step2Form.values.voteTokenType === 'Both'
            ? HolderType.Both
            : step2Form.values.voteTokenType === 'Shares'
              ? HolderType.Share
              : step2Form.values.voteTokenType === 'Loot'
                ? HolderType.Loot
                : HolderType.None,
        dao: ADDR.DAO,
        blockTimestamp: 'now',
      },
    });

    tx({
      writeContractParams: {
        abi: factory,
        functionName: 'buildContest',
        address: ADDR.FACTORY,
        args,
      },
      writeContractOptions: {
        onPollSuccess() {
          setContestTag(filterTag);
          navigate(`/create-contest/2`);
        },
      },
    });
  };

  return (
    <CenterLayout>
      <Box w="100%" maw="500px" miw="350px" mb={'lg'}>
        <SubTitle mb="lg">Create Contest</SubTitle>
        <Button
          variant="secondary"
          size="xs"
          onClick={() => navigate(-1)}
          leftSection={<IconArrowLeft size={16} />}
        >
          Back
        </Button>
      </Box>
      <Routes>
        <Route
          path="0"
          element={<Form1 nextForm={nextForm} form={step1Form} />}
        />
        <Route
          path="1"
          element={<Form2 handleSubmit={handleSubmit} form={step2Form} />}
        />
        <Route path="2" element={<FormComplete contestId={contestTag} />} />
        <Route path="*" element={<Navigate to="0" replace />} />
      </Routes>
    </CenterLayout>
  );
};

const Form1 = ({
  nextForm,
  form,
}: {
  nextForm: () => void;
  form: CreateContest1Values;
}) => {
  return (
    <Stack w="100%" maw="500px" miw="350px" mb="xl" gap="lg">
      <Paper>
        <TextInput
          required
          label="Title"
          placeholder="What is the best way to skin a cat?"
          {...form.getInputProps('title')}
        />
      </Paper>
      <Paper>
        <TextBoss
          label="Description"
          placeholder="Write your description here"
          data-path={form.getInputProps('description')}
          {...form.getInputProps('description')}
        />
      </Paper>
      <Paper>
        <TextInput
          label="Link"
          placeholder="https://example.com"
          {...form.getInputProps('link')}
        />
      </Paper>
      <Group justify="center">
        <Button onClick={nextForm} disabled={!form.isValid()}>
          Next
        </Button>
      </Group>
    </Stack>
  );
};

const Form2 = ({
  handleSubmit,
  form,
}: {
  handleSubmit: () => void;
  form: CreateContest2Values;
}) => {
  const theme = useMantineTheme();
  return (
    <Stack w="100%" maw="500px" miw="350px" mb="xl" gap="lg">
      <Paper>
        <Text mb="lg" fw={700}>
          Choice Period
        </Text>
        <Stack fz={'sm'}>
          <Select
            data={Object.keys(Times)}
            label={
              <InputLabel fz="sm" c={theme.colors.steel[2]}>
                Submission Time
              </InputLabel>
            }
            required
            allowDeselect={false}
            {...form.getInputProps('choiceTime')}
          />
          <Select
            data={['Both', 'Loot', 'Shares']}
            label={
              <InputLabel fz="sm" c={theme.colors.steel[2]}>
                Gate Token
              </InputLabel>
            }
            required
            allowDeselect={false}
            {...form.getInputProps('choiceTokenType')}
            description={
              form.values.choiceTokenType === 'Shares'
                ? 'Applicants with DAO shares can submit'
                : form.values.choiceTokenType === 'Loot'
                  ? 'Applicants with DAO loot can submit'
                  : 'Applicants with both DAO tokens can submit'
            }
          />
          <NumberInput
            label={
              <InputLabel fz="sm" c={theme.colors.steel[2]}>
                Gate Token Amount
              </InputLabel>
            }
            required
            hideControls
            mb="md"
            {...form.getInputProps('choiceTokenAmount')}
            description={`Minimum amount of ${form.values.choiceTokenAmount} ${form.values.choiceTokenType === 'Both' ? 'tokens (either)' : form.values.choiceTokenType} required to submit`}
          />
          <Box className={globalClasses.subBorder} p="md">
            <Text fz="xs" mb="sm">
              DAO members require at least{' '}
              <Bold>{form.values.choiceTokenAmount}</Bold>{' '}
              <Bold>
                {form.values.choiceTokenType === 'Both'
                  ? 'tokens (either)'
                  : form.values.choiceTokenType}
              </Bold>{' '}
              to create choices for this contest
            </Text>
            <Text fz="xs">
              Choice submission round will last for{' '}
              <Bold>{form.values.choiceTime}</Bold>
            </Text>
          </Box>
        </Stack>
      </Paper>
      <Paper>
        <Text mb="lg" fw={700}>
          Voting Period
        </Text>
        <Stack fz={'sm'}>
          <Select
            data={Object.keys(Times)}
            label={
              <InputLabel fz="sm" c={theme.colors.steel[2]}>
                Voting Time
              </InputLabel>
            }
            required
            allowDeselect={false}
            {...form.getInputProps('votingTime')}
          />
          <Select
            data={['Both', 'Loot', 'Shares']}
            label={
              <InputLabel fz="sm" c={theme.colors.steel[2]}>
                Voting Token
              </InputLabel>
            }
            required
            allowDeselect={false}
            {...form.getInputProps('voteTokenType')}
            description={
              form.values.voteTokenType === 'Shares'
                ? 'Voters can vote with DAO shares (voting token)'
                : form.values.voteTokenType === 'Loot'
                  ? 'Voters can vote with DAO loot (non-voting token)'
                  : 'Voters can vote with both DAO tokens'
            }
          />
          <Select
            data={Object.values(ChoiceInputType)}
            label={
              <InputLabel fz="sm" c={theme.colors.steel[2]}>
                Answer Type
              </InputLabel>
            }
            required
            allowDeselect={false}
            mb="md"
            description={
              form.values.answerType === 'Single Choice'
                ? 'Voters allocate 100% of their token on one choice'
                : form.values.answerType === 'Allocation (%)'
                  ? 'Voters can choose how much to allocate to each choice'
                  : 'Choose how voters respond to the contest'
            }
            {...form.getInputProps('answerType')}
          />
          <Box className={globalClasses.subBorder} p="md">
            <Text fz="xs" mb="sm">
              Voters can use <Bold>{form.values.voteTokenType} tokens</Bold> to
              vote
            </Text>
            <Text fz="xs" mb="sm">
              {form.values.answerType === 'Single Choice'
                ? 'Voters allocate 100% of their token on one choice'
                : form.values.answerType === 'Allocation (%)'
                  ? 'Voters can choose how much to allocate to each choice'
                  : 'Choose how voters respond to the contest'}
            </Text>
            <Text fz="xs">
              Voting round will last for <Bold>{form.values.votingTime}</Bold>
            </Text>
          </Box>
        </Stack>
      </Paper>
      <Group justify="center">
        <TxButton onClick={handleSubmit} disabled={!form.isValid()}>
          Submit
        </TxButton>
      </Group>
    </Stack>
  );
};

const FormComplete = ({ contestId }: { contestId?: string }) => {
  const theme = useMantineTheme();
  const { copy } = useClipboard();

  return (
    <Stack gap="lg" w="100%" maw="500px" miw="350px" mb="xl">
      <Paper>
        <Text fw={600} mb="sm" c={theme.colors.steel[0]}>
          Completed
        </Text>
        <Text c={theme.colors.steel[2]}> Your contest has been created</Text>
      </Paper>
      {contestId && (
        <Paper>
          <Text c={theme.colors.steel[0]} fw={600} mb="sm">
            Your Contest Link
          </Text>

          <Group mb="md" gap="xs">
            <Text
              component={Link}
              to={`/contest/${contestId}`}
              className={globalClasses.appLink}
              c={theme.colors.steel[4]}
            >
              See your Contest
            </Text>
            <IconArrowRight size={16} color={theme.colors.steel[4]} />
          </Group>
          <Button
            leftSection={<IconCopy size={16} />}
            onClick={() => {
              notifications.show({
                title: 'Copied',
                message: 'Contest link copied to clipboard',
                color: 'teal',
              });
              copy(`https://ask.haus/contest/${contestId}`);
            }}
          >
            Copy Link
          </Button>
        </Paper>
      )}
    </Stack>
  );
};
