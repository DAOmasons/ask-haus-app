import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import '@mantine/tiptap/styles.css';

import { MantineProvider } from '@mantine/core';
import { theme as mantineTheme } from './theme';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { config, customRBKTheme } from './utils/connect';
import { Layout } from './layout/Layout';
import { BrowserRouter } from 'react-router-dom';
import { ClientRoutes } from './Routes';
import { TxProvider } from './contexts/TxContext';
import { Notifications } from '@mantine/notifications';
const queryClient = new QueryClient();

export default function App() {
  return (
    <BrowserRouter>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={customRBKTheme}>
            <MantineProvider theme={mantineTheme} defaultColorScheme="dark">
              <TxProvider>
                <Notifications />
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
