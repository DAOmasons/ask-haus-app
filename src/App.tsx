import '@mantine/core/styles.css';
import { Button, MantineProvider, TextInput } from '@mantine/core';
import { theme } from './theme';

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <div>
        App <Button>Button</Button>
        <TextInput label="test" />
      </div>
    </MantineProvider>
  );
}
