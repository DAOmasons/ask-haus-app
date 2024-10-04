import {
  darkTheme,
  getDefaultConfig,
  Theme as RainbowKitTheme,
} from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { arbitrum } from 'wagmi/chains';
import { DARK, STEEL } from '../theme';

export const config = getDefaultConfig({
  appName: 'AskHaus',
  projectId: import.meta.env.VITE_RBK_PROJECT_ID,
  chains: [arbitrum],
  ssr: false,
  transports: {
    [arbitrum.id]: http(import.meta.env.VITE_RPC_URL),
  },
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
