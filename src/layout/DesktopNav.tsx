import { Group, Text, useMantineTheme } from '@mantine/core';

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
        <Text c={theme.colors.steel[2]}>Create</Text>
        <Text c={theme.colors.steel[2]}>Live</Text>
        <Text c={theme.colors.steel[2]}>Past</Text>
        <Text c={theme.colors.steel[2]}>My</Text>
        <Text c={theme.colors.steel[2]}>Wallet</Text>
      </Group>
    </Group>
  );
};
