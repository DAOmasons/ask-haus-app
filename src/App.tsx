import '@mantine/core/styles.css';

import {
  Box,
  Button,
  Group,
  MantineProvider,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { theme as mantineTheme } from './theme';

export default function App() {
  return (
    <MantineProvider theme={mantineTheme} defaultColorScheme="dark">
      <TestUI />
    </MantineProvider>
  );
}

const TestUI = () => {
  return (
    <Box w="500px" mx={64} h="600px" my={32}>
      <TestNav />
      <div>
        App <Button>Button</Button>
        <TextInput label="test" mb="lg" />
      </div>
      <TestColors />
    </Box>
  );
};

const TestNav = () => {
  const theme = useMantineTheme();

  return (
    <Group align="center" mb="lg">
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
        <Text c={theme.colors.steel[2]}>Active</Text>
        <Text c={theme.colors.steel[2]}>My</Text>
        <Text c={theme.colors.steel[2]}>Wallet</Text>
      </Group>
    </Group>
  );
};

const TestColors = () => {
  const theme = useMantineTheme();

  return (
    <Stack>
      <Text fz="lg" c={theme.colors.steel[9]}>
        Steel 9
      </Text>
      <Text fz="lg" c={theme.colors.steel[8]}>
        Steel 8
      </Text>
      <Text fz="lg" c={theme.colors.steel[7]}>
        Steel 7
      </Text>
      <Text fz="lg" c={theme.colors.steel[6]}>
        Steel 6
      </Text>
      <Text fz="lg" c={theme.colors.steel[5]}>
        Steel 5
      </Text>
      <Text fz="lg" c={theme.colors.steel[4]}>
        Steel 4
      </Text>
      <Text fz="lg" c={theme.colors.steel[3]}>
        Steel 3
      </Text>
      <Text fz="lg" c={theme.colors.steel[2]}>
        Steel 2
      </Text>
      <Text fz="lg" c={theme.colors.steel[1]}>
        Steel 1
      </Text>
      <Text fz="lg" c={theme.colors.steel[0]}>
        Steel 0
      </Text>
    </Stack>
  );
};
