import { Group, useMantineTheme } from '@mantine/core';
import { AppLink } from '../components/Links';
import { TextButton } from '../components/Typography';
import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Notice } from '../components/Notice';
import { AddressAvatar } from '../components/AddressAvatar';

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
      >
        ask.haus
      </AppLink>
      <Group gap={32}>
        <AppLink c={theme.colors.steel[2]} url="/ask">
          Ask
        </AppLink>
        <AppLink c={theme.colors.steel[2]} url="/live">
          Live
        </AppLink>
        <AppLink c={theme.colors.steel[2]} url="/past">
          Past
        </AppLink>
        {/* <AppLink c={theme.colors.steel[2]} url="/dorks">
          Dorks
        </AppLink> */}
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

  if (isConnected && address) {
    return (
      <AddressAvatar
        address={address}
        displayPfp={false}
        onClick={openAccountModal}
      />
    );
  }

  return (
    <Group gap={5} align="start">
      <TextButton
        c={theme.colors.steel[2]}
        onClick={() => {
          openConnectModal?.();
        }}
      >
        Wallet
      </TextButton>
      <Notice
        blink
        content="Get your wallet connected"
        onClick={openConnectModal}
      />
    </Group>
  );
};
