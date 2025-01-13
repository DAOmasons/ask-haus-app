import {
  Box,
  Flex,
  Text,
  useMantineTheme,
  Menu,
  Modal,
  Stack,
  Button,
  Group,
} from '@mantine/core';
import { TextButton } from '../components/Typography';
import { Notice } from '../components/Notice';
import { AddressAvatar } from '../components/AddressAvatar';
import { useClipboard, useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { appNetwork } from '../utils/config';
import { navItems } from '../constants/navItems';
import { Link, useLocation } from 'react-router-dom';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit';
import {
  IconChevronUp,
  IconCopy,
  IconExclamationCircle,
  IconLogout,
  IconUserCircle,
} from '@tabler/icons-react';

export const MobileNav = () => {
  const theme = useMantineTheme();
  const location = useLocation();
  const { address, isConnected, chain } = useAccount();
  const [menuOpen, setMenuOpen] = useState(false);
  const { copy } = useClipboard();
  const { switchChain } = useSwitchChain();
  const { disconnect } = useDisconnect();
  const isCorrectNetwork = appNetwork.id === chain?.id;

  return (
    <Box w="100%">
      <Box
        pos="fixed"
        bottom={0}
        bg={theme.colors.dark[7]}
        w="100%"
        style={{ zIndex: 10, borderTop: '1px solid #333' }}
      >
        <Flex justify={'space-around'} align="center">
          {navItems
            .filter((item) => item.link)
            .map((item) => {
              const isActive = location.pathname === item.link;
              return (
                <Flex
                  key={item.link}
                  component={Link}
                  to={item.link as string}
                  direction="column"
                  align="center"
                  w="fit-content"
                  p={4}
                  px={'xs'}
                  td="none"
                  style={{
                    borderBottom: `2px solid ${
                      isActive ? theme.colors.blue[6] : 'transparent'
                    }`,
                  }}
                >
                  <item.icon size={24} />
                  <Text size="xs" mt={2}>
                    {item.label}
                  </Text>
                </Flex>
              );
            })}

          {isConnected ? (
            <Menu opened={menuOpen} onChange={setMenuOpen} offset={12}>
              <Menu.Target>
                <IconChevronUp size={24} />
              </Menu.Target>
              <Menu.Dropdown w="100%">
                {!isCorrectNetwork && (
                  <Menu.Item
                    onClick={() => {
                      switchChain({ chainId: appNetwork.id });
                    }}
                    leftSection={
                      <IconExclamationCircle color={theme.colors.yellow[6]} />
                    }
                  >
                    Switch to {appNetwork.name}
                  </Menu.Item>
                )}
                <Menu.Item
                  leftSection={<IconCopy />}
                  onClick={() => {
                    copy(address);
                    notifications.show({
                      title: 'Address Copied',
                      message: `Address: ${address} has been copied to clipboard`,
                    });
                  }}
                >
                  Copy Address
                </Menu.Item>

                <Menu.Item
                  leftSection={<IconLogout />}
                  onClick={() => disconnect()}
                >
                  Disconnect
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <ConnectButton />
          )}
        </Flex>
      </Box>
    </Box>
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
      <Flex
        direction="column"
        align="center"
        w="fit-content"
        onClick={() => {
          openConnectModal?.();
        }}
      >
        <IconUserCircle size={24} />
        <Text size="xs">Connect</Text>
      </Flex>
      <Notice blink content="Connect your wallet" onClick={openConnectModal} />
    </Group>
  );
};
