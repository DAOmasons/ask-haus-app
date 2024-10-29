import {
  darkTheme,
  getDefaultConfig,
  Theme as RainbowKitTheme,
} from '@rainbow-me/rainbowkit';
import { createPublicClient, http } from 'viem';
import { arbitrum, mainnet } from 'wagmi/chains';
import { DARK, STEEL } from '../theme';
import { createConfig } from 'wagmi';

// derive from env later on
export const appNetwork = arbitrum;

export const config = getDefaultConfig({
  appName: 'AskHaus',
  projectId: import.meta.env.VITE_RBK_PROJECT_ID,
  chains: [appNetwork],
  ssr: false,
  transports: {
    [appNetwork.id]: http(import.meta.env.VITE_RPC_URL),
  },
});

export const publicClient = createPublicClient({
  chain: appNetwork,
  transport: http(import.meta.env.VITE_RPC_URL),
});

export const customRBKTheme = {
  ...darkTheme({
    accentColor: STEEL[4],
    accentColorForeground: STEEL[0],
  }),
  colors: {
    ...darkTheme().colors,
    modalBackground: DARK[7],
    accentColor: STEEL[5],
    closeButton: STEEL[0],
    closeButtonBackground: 'transparent',
    modalBorder: STEEL[2],
    modalText: STEEL[0],
    actionButtonSecondaryBackground: DARK[7],
    generalBorder: STEEL[5],
    modalBackdrop: 'rgba(0, 0, 0, 0.7)',
  },
  fonts: {
    body: 'Sora',
  },
  radii: {
    ...darkTheme().radii,
    modal: '4px',
    menuButton: '4px',
    modalMobile: '4px',
    actionButton: '4px',
  },
} as RainbowKitTheme;

export const ensConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(import.meta.env.VITE_RPC_URL_ENS_MAINNET),
  },
});
