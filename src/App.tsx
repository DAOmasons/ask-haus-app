import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@rainbow-me/rainbowkit/styles.css';

import {
  Button,
  Group,
  InputLabel,
  MantineProvider,
  Paper,
  Radio,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { theme as mantineTheme } from './theme';
import { useState } from 'react';

import { IconArrowLeft } from '@tabler/icons-react';

import {
  RainbowKitProvider,
  useAccountModal,
  useConnectModal,
} from '@rainbow-me/rainbowkit';

import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { config, customRBKTheme } from './utils/connect';
import { CenterLayout, Layout } from './layout/Layout';
import { BrowserRouter } from 'react-router-dom';
import { ClientRoutes } from './Routes';
import { TxProvider } from './contexts/TxContext';
const queryClient = new QueryClient();

export default function App() {
  return (
    <BrowserRouter>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={customRBKTheme}>
            <MantineProvider theme={mantineTheme} defaultColorScheme="dark">
              <TxProvider>
                <Layout>
                  <ClientRoutes />
                </Layout>
              </TxProvider>
            </MantineProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </BrowserRouter>
  );
}

const TestUI = () => {
  const [choice, setChoice] = useState('');
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();

  return (
    <Layout>
      <CenterLayout>
        <Group mb="xl" w="100%" maw="500px">
          <IconArrowLeft size={28} />
          <Text fz="xl" fw={700} ml="30%">
            Create Poll
          </Text>
        </Group>
        <Stack w="100%" maw="500px" miw="350px" mb="xl" gap="lg">
          <Paper>
            <TextInput
              required
              label="Input Label"
              placeholder="Input"
              description="Description"
            />
          </Paper>
          <Paper>
            <Textarea
              label="Textarea"
              placeholder="Textarea"
              description="test"
            />
          </Paper>
          <Paper>
            <Select
              data={['test', 'test2', 'test3']}
              label="Select"
              description="Description"
            />
          </Paper>
          <Paper>
            <InputLabel>Answer</InputLabel>
            <Stack gap={'sm'}>
              <Radio
                label="Test 1"
                value="test1"
                onChange={() => setChoice('test1')}
                checked={choice === 'test1'}
              />
              <Radio
                label="Test 1"
                value="test1"
                checked={choice === 'test2'}
                onChange={() => setChoice('test2')}
              />
            </Stack>
          </Paper>
          <Paper>
            <DateTimePicker label="Date" />
          </Paper>
        </Stack>
        {/* <Button>{'Next >'}</Button> */}
        {openConnectModal && (
          <Button onClick={openConnectModal}>Connect</Button>
        )}
        {openAccountModal && (
          <Button onClick={openAccountModal}>Account</Button>
        )}
      </CenterLayout>
    </Layout>
  );
};
