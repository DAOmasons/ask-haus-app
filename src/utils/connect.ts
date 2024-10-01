import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { arbitrum } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'AskHaus',
  projectId: import.meta.env.VITE_RBK_PROJECT_ID,
  chains: [arbitrum],
  ssr: false,
  transports: {
    [arbitrum.id]: http(import.meta.env.VITE_RPC_URL),
  },
});
