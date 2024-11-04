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
import { SubTitle } from '../components/Typography';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useTx } from '../hooks/useTx';
import { useState } from 'react';
import { TextBoss } from '../components/TextBoss';
import { Times } from '../utils/time';
import { TxButton } from '../components/TxButton';
import { IconArrowLeft } from '@tabler/icons-react';
import { ChoiceInputType } from '../constants/enum';
import globalClasses from '../styles/global.module.css';
import { useForm, zodResolver } from '@mantine/form';
import { createContestSchema1 } from '../schema/form/create';

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
    initialValues: {},
    validate: zodResolver(createContestSchema1),
  });

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
        <Route path="0" element={<Form1 nextForm={nextForm} />} />
        <Route path="1" element={<Form2 />} />
        <Route path="2" element={<FormComplete />} />
        <Route path="*" element={<Navigate to="0" replace />} />
      </Routes>
    </CenterLayout>
  );
};

const Form1 = ({ nextForm }: { nextForm: () => void }) => {
  return (
    <Stack w="100%" maw="500px" miw="350px" mb="xl" gap="lg">
      <Paper>
        <TextInput
          required
          label="Title"
          placeholder="What is the best way to skin a cat?"
        />
      </Paper>
      <Paper>
        <TextBoss
          required
          label="Description"
          placeholder="Write your description here"
        />
      </Paper>
      <Paper>
        <TextInput label="Link" placeholder="https://example.com" />
      </Paper>
      <Group justify="center">
        <Button onClick={nextForm}>Next</Button>
      </Group>
    </Stack>
  );
};

const Form2 = () => {
  const theme = useMantineTheme();
  return (
    <Stack w="100%" maw="500px" miw="350px" mb="xl" gap="lg">
      <Paper>
        <Text mb="lg" fw={700}>
          Choice Period
        </Text>
        <Stack fz={'sm'}>
          <Select
            data={[...Object.keys(Times), 'Custom']}
            label={
              <InputLabel fz="sm" c={theme.colors.steel[2]}>
                Submission Time
              </InputLabel>
            }
            required
            allowDeselect={false}
            // {...form.getInputProps('time')}
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
            // {...form.getInputProps('time')}
          />
          <NumberInput
            label={
              <InputLabel fz="sm" c={theme.colors.steel[2]}>
                Gate Token Amount
              </InputLabel>
            }
            required
            // allowDecimal={false}
            hideControls
            mb="md"
          />
          <Box className={globalClasses.subBorder} p="md">
            <Text fz="xs" mb="sm">
              DAO members who have 500 shares or more are allowed to submit
              choices for this contest.
            </Text>
            <Text fz="xs">
              Members can submit choices from Oct 12th to Dec 31st.
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
            data={[...Object.keys(Times), 'Custom']}
            label={
              <InputLabel fz="sm" c={theme.colors.steel[2]}>
                Voting Time
              </InputLabel>
            }
            required
            allowDeselect={false}
            // {...form.getInputProps('time')}
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
            // {...form.getInputProps('time')}
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
            // description={
            //   form.values.answerType === 'Single Choice'
            //     ? 'Voters allocate 100% of their token on one choice'
            //     : form.values.answerType === 'Allocation (%)'
            //       ? 'Voters can choose how much to allocate to each choice'
            //       : 'Choose how voters respond to the poll'
            // }
            // {...form.getInputProps('answerType')}
          />
          <Box className={globalClasses.subBorder} p="md">
            <Text fz="xs" mb="sm">
              Voters can use both loot and shares tokens to vote from Feb 27th
              to Feb 29th.
            </Text>
            <Text fz="xs">
              Voters will be able to distribute a % voting power across many
              options.
            </Text>
          </Box>
        </Stack>
      </Paper>
      <Group justify="center">
        <TxButton>Submit</TxButton>
      </Group>
    </Stack>
  );
};

const FormComplete = () => {
  return <> </>;
};
