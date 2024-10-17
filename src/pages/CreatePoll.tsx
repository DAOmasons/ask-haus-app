import { Button, Paper, Select, Stack, TextInput } from '@mantine/core';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { ADDR } from '../constants/address';
import Factory from '../abi/FastFactory.json';
import { pollTestArgs } from '../utils/factory';
import { CenterLayout, CenterPageTitle } from '../layout/Layout';
import { useForm, zodResolver } from '@mantine/form';
import { createPollSchema } from '../schema/form/create';
import { DateTimePicker } from '@mantine/dates';

export const CreatePoll = () => {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const form = useForm({
    initialValues: {
      title: '',
      details: '',
      time: '',
      customTimeStart: '',
      customTimeEnd: '',
      answerType: '',
      tokenType: '',
    },
    validate: zodResolver(createPollSchema),
  });

  const handleCreatePoll = async () => {
    if (!publicClient) return;

    const nowInSeconds = Math.floor(Date.now() / 1000);

    const pollArgs = pollTestArgs(BigInt(nowInSeconds) - 1n);

    const { request } = await publicClient.simulateContract({
      account: address,
      address: ADDR.FACTORY,
      abi: Factory,
      functionName: 'buildContest',
      args: pollArgs,
    });

    const hash = await walletClient?.writeContract(request);

    if (hash) {
      console.log(hash);
    }
  };

  return (
    <CenterLayout>
      <CenterPageTitle title="Create Poll" />
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
            data={['Five Minutes', 'One Hour', 'One Day', 'One Week', 'Custom']}
            label="Select"
            description="Description"
            {...form.getInputProps('time')}
          />
        </Paper>
        <Paper>
          <DateTimePicker
            label="Start"
            highlightToday
            {...form.getInputProps('customTimeStart')}
          />
        </Paper>
      </Stack>
      <Button onClick={handleCreatePoll}>Next</Button>
    </CenterLayout>
  );
};
