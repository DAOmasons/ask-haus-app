import { Group, Text, useMantineTheme } from '@mantine/core';
import { AppLink } from '../components/Links';

export const DesktopNav = () => {
  const theme = useMantineTheme();

  return (
    <Group align="center">
      <Text
        mr={88}
        fz={24}
        c={theme.colors.steel[0]}
        fw={300}
        style={{ letterSpacing: '1px' }}
      >
        ask.haus
      </Text>
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
        <AppLink c={theme.colors.steel[2]} url="/wallet">
          Wallet
        </AppLink>
      </Group>
    </Group>
  );
};
