import {
  Box,
  Flex,
  Text,
  useMantineTheme,
  Menu,
  Modal,
  Stack,
  Button,
  MenuItem,
} from '@mantine/core';
import { useClipboard, useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { appNetwork } from '../utils/config';
import { navItems } from '../constants/navItems';
import { Link, useLocation } from 'react-router-dom';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import {
  IconAward,
  IconChevronUp,
  IconClock,
  IconCopy,
  IconExclamationCircle,
  IconExternalLink,
  IconLogout,
  IconPacman,
  IconRocket,
  IconShieldHalf,
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
            <Connect />
          )}
        </Flex>
      </Box>
    </Box>
  );
};

const Connect = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { connectors, connect } = useConnect();
  return (
    <>
      <Flex direction="column" align="center" w="fit-content" onClick={open}>
        <IconUserCircle size={24} />
        <Text size="xs">Connect</Text>
      </Flex>
      <Modal opened={opened} onClose={close} centered title="Connect Wallet">
        <Stack>
          {[...connectors]?.reverse()?.map((connector) => (
            <Button
              key={connector.uid}
              onClick={() => {
                close();
                connect({ connector });
              }}
            >
              {connector.name}
            </Button>
          ))}
        </Stack>
      </Modal>
    </>
  );
};
