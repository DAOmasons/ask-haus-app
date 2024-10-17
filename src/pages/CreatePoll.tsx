import {
  Button,
  Paper,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { CenterLayout, CenterPageTitle } from '../layout/Layout';
import { useForm, UseFormReturnType, zodResolver } from '@mantine/form';
import { createPollSchema1, createPollSchema2 } from '../schema/form/create';
import { DateTimePicker } from '@mantine/dates';
import { useState } from 'react';
import { z } from 'zod';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { ChoiceRepeater, FormChoice } from '../components/form/ChoiceRepeater';

type Form1Schema = z.infer<typeof createPollSchema1>;
type Form1 = UseFormReturnType<
  Form1Schema,
  (values: Form1Schema) => Form1Schema
>;

type Form2Schema = z.infer<typeof createPollSchema2>;
type Form2 = UseFormReturnType<
  Form2Schema,
  (values: Form2Schema) => Form2Schema
>;

export const CreatePoll = () => {
  // const { data: walletClient } = useWalletClient();
  // const publicClient = usePublicClient();
  // const { address } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const formIndex = location.pathname.split('/').slice(-1)[0];

  const step1Form = useForm({
    initialValues: {
      title: '',
      answerType: 'Single Choice',
      tokenType: 'Both',
      time: 'One Day',
      customTimeStart: new Date(),
      customTimeEnd: new Date(new Date().setDate(new Date().getDate() + 7)),
    },
    validate: zodResolver(createPollSchema1),
    validateInputOnBlur: true,
  });

  const step2Form = useForm({
    initialValues: {
      description: '',
      choices: [],
    },
    validate: zodResolver(createPollSchema2),
    validateInputOnBlur: true,
  });

  // const handleCreatePoll = async () => {
  //   if (!publicClient) return;

  //   const nowInSeconds = Math.floor(Date.now() / 1000);

  //   const pollArgs = pollTestArgs(BigInt(nowInSeconds) - 1n);

  //   const { request } = await publicClient.simulateContract({
  //     account: address,
  //     address: ADDR.FACTORY,
  //     abi: Factory,
  //     functionName: 'buildContest',
  //     args: pollArgs,
  //   });

  //   const hash = await walletClient?.writeContract(request);

  //   if (hash) {
  //     console.log(hash);
  //   }
  // };

  const advanceForm = () => {
    if (formIndex === '0') {
      const result = step1Form.validate();
      if (result.hasErrors) {
        console.error(result.errors);
        return;
      }
    }
    navigate(`/create-poll/1`);
  };

  return (
    <CenterLayout>
      <CenterPageTitle title="Create Poll" />
      <Routes>
        <Route
          path="0"
          element={
            <Form1
              form={step1Form as unknown as Form1}
              advanceForm={advanceForm}
            />
          }
        />
        <Route
          path="1"
          element={
            <Form2
              pollTitle={step1Form.values.title}
              form={step2Form as unknown as Form2}
            />
          }
        />
        <Route path="*" element={<Navigate to="0" replace />} />
      </Routes>
    </CenterLayout>
  );
};

const Form1 = ({
  form,
  advanceForm,
}: {
  form: Form1;
  advanceForm: () => void;
}) => {
  return (
    <>
      <Stack w="100%" maw="500px" miw="350px" mb="xl" gap="lg">
        <Paper>
          <TextInput
            required
            label="Poll Title"
            placeholder="What is your favorite color?"
            description="Ask a key question that you would like to Public Haus"
            {...form.getInputProps('title')}
          />
        </Paper>
        <Paper>
          <Select
            data={['Single Choice', 'Allocation (%)']}
            label="Answer Type"
            required
            allowDeselect={false}
            description={
              form.values.answerType === 'Single Choice'
                ? 'Voters allocate 100% of their token on one choice'
                : form.values.answerType === 'Allocation (%)'
                  ? 'Voters can choose how much to allocate to each choice'
                  : 'Choose how voters respond to the poll'
            }
            {...form.getInputProps('answerType')}
          />
        </Paper>
        <Paper>
          <Select
            data={['Shares', 'Loot', 'Both']}
            label="Token Type"
            required
            allowDeselect={false}
            {...form.getInputProps('tokenType')}
            description={
              form.values.tokenType === 'Shares'
                ? 'Voters can vote with DAO shares (voting token)'
                : form.values.tokenType === 'Loot'
                  ? 'Voters can vote with DAO loot (non-voting token)'
                  : 'Voters can vote with both DAO tokens'
            }
          />
        </Paper>
        <Paper>
          <Select
            data={['Five Minutes', 'One Hour', 'One Day', 'One Week', 'Custom']}
            label="Voting Time"
            required
            allowDeselect={false}
            {...form.getInputProps('time')}
          />
        </Paper>

        {form.values.time === 'Custom' && (
          <>
            <Paper>
              <DateTimePicker
                label="Start"
                highlightToday
                clearable
                labelProps={{
                  fw: 400,
                  fz: 14,
                }}
                {...form.getInputProps('customTimeStart')}
                defaultValue={new Date()}
                onDateChange={(e) => console.log(e.toUTCString())}
              />
            </Paper>
            <Paper>
              <DateTimePicker
                label="End"
                clearable
                labelProps={{
                  fw: 400,
                  fz: 14,
                }}
                {...form.getInputProps('customTimeEnd')}
                onDateChange={(e) => console.log(e.toUTCString())}
              />
            </Paper>
          </>
        )}
      </Stack>
      <Button onClick={advanceForm}>Next</Button>
    </>
  );
};

const Form2 = ({ pollTitle, form }: { pollTitle: string; form: Form2 }) => {
  const handleAddChoice = (choice: FormChoice) => {
    // setChoices((prevState) => [...prevState, choice]);

    form.setFieldValue('choices', [...form.values.choices, choice]);
  };

  const handleDeleteChoice = (choice: FormChoice) => {
    // setChoices((prevState) => prevState.filter((c) => c.id !== choice.id));

    form.setFieldValue(
      'choices',
      form.values.choices.filter((c) => c.id !== choice.id)
    );
  };

  const handleEditChoice = (choice: FormChoice) => {
    // setChoices((prevState) => {
    //   return prevState.map((c) => {
    //     if (c.id === choice.id) {
    //       return choice;
    //     }
    //     return c;
    //   });
    // });

    form.setFieldValue(
      'choices',
      form.values.choices.map((c) => {
        if (c.id === choice.id) {
          return choice;
        }
        return c;
      })
    );
  };

  const handleColorChange = (choice: FormChoice) => {
    form.setFieldValue(
      'choices',
      form.values.choices.map((c) => {
        if (c.id === choice.id) {
          return choice;
        }
        return c;
      })
    );
  };

  return (
    <Stack w="100%" maw="500px" miw="350px" mb="xl" gap="lg">
      <Paper>
        <Text fw={600}>{pollTitle}</Text>
      </Paper>
      <Paper w="100%">
        <ChoiceRepeater
          choices={form.values.choices}
          onAdd={handleAddChoice}
          onColorChange={handleColorChange}
          onDelete={handleDeleteChoice}
          onEdit={handleEditChoice}
        />
      </Paper>
      <Paper>
        <Textarea
          label="Poll Description"
          placeholder="Optional."
          maxRows={10}
          description="Optional. Provide additional context about the poll."
          {...form.getInputProps('pollDescription')}
        />
      </Paper>
    </Stack>
  );
};
