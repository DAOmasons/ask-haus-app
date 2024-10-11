import { Box, Group, Skeleton, Text, useMantineTheme } from '@mantine/core';
import { AppLink } from '../components/Links';
import { TextButton } from '../components/Typography';
import globalClasses from '../styles/global.module.css';
import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Notice } from '../components/Notice';

export const DesktopNav = () => {
  const theme = useMantineTheme();

  return (
    <Group align="center">
      <AppLink
        url="/"
        mr={88}
        fz={24}
        c={theme.colors.steel[0]}
        fw={300}
        style={{ letterSpacing: '1px' }}

        // h="fit-content"
        // p={0}
      >
        ask.haus
      </AppLink>
      <Group gap={32}>
        <AppLink c={theme.colors.steel[2]} url="/create">
          Create
        </AppLink>
        <AppLink c={theme.colors.steel[2]} url="/live">
          Live
        </AppLink>
        <AppLink c={theme.colors.steel[2]} url="/past">
          Past
        </AppLink>
        <AppLink c={theme.colors.steel[2]} url="/my">
          My
        </AppLink>
        <ConnectButton />
      </Group>
    </Group>
  );
};

const ConnectButton = () => {
  const { address, isConnected } = useAccount();
  const theme = useMantineTheme();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();

  if (isConnected) {
    return (
      <TextButton
        c={theme.colors.steel[2]}
        onClick={() => {
          openAccountModal?.();
        }}
      >
        {address}
      </TextButton>
    );
  }

  return (
    <Group gap={8} align="start">
      <TextButton
        c={theme.colors.steel[2]}
        onClick={() => {
          openConnectModal?.();
        }}
      >
        Wallet
      </TextButton>
      <Notice />
    </Group>
  );
};
