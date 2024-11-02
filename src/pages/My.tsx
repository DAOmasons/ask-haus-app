import {
  Box,
  Button,
  ColorSwatch,
  Group,
  Paper,
  SegmentedControl,
  Slider,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { CenterLayout } from '../layout/Layout';
import { useState } from 'react';
import { SubTitle } from '../components/Typography';
import { IconExternalLink, IconSearch } from '@tabler/icons-react';
import { AddressAvatar } from '../components/AddressAvatar';

export const My = () => {
  return (
    <CenterLayout>
      <Box w="100%" maw={500}>
        <ExampleTwo />
      </Box>
    </CenterLayout>
  );
};

const ExampleTwo = () => {
  const theme = useMantineTheme();
  const [values, setValues] = useState([
    { color: 'chocolate', value: 0, label: 'Chocolate' },
    { color: 'pink', value: 0, label: 'Strawberry' },
    { color: 'white', value: 0, label: 'Vanilla' },
    { color: 'green', value: 0, label: 'Mint Chip' },
  ]);

  // const totalRemaining =  //   100 - values.reduce((sum, item) => sum + item.value, 0);

  const totalAllocated = values.reduce((sum, item) => sum + item.value, 0);

  const handleSliderChange = (index: number, newValue: number) => {
    const otherValuesTotal = values.reduce(
      (sum, item, i) => (i !== index ? sum + item.value : sum),
      0
    );

    // Calculate maximum allowed value for this slider
    const maxAllowed = 100 - otherValuesTotal;

    // Ensure the new value doesn't exceed available percentage
    const clampedValue = Math.min(newValue, maxAllowed);

    setValues((prevValues) =>
      prevValues.map((item, i) =>
        i === index ? { ...item, value: clampedValue } : item
      )
    );
  };

  return (
    <CenterLayout>
      <Box w="100%" mb="lg">
        <Group mb="sm" align="start" justify="space-between">
          <SubTitle>Poll</SubTitle>
          <SegmentedControl data={['Vote', 'Results']} size="xs" />
        </Group>
        <Group justify="space-between">
          <Text c={theme.colors.steel[2]} fz="sm">
            Ends In 1d 1h 1m 1s
          </Text>
          <AddressAvatar
            size={20}
            fz={'sm'}
            gap={'xs'}
            address={'0xde6bcde54cf040088607199fc541f013ba53c21e'}
          />
        </Group>
      </Box>
      <Stack w="100%" maw={500} gap={'xl'} mb="xl">
        <Paper>
          <Group mb="sm" gap="0">
            <Text fw={600} c={theme.colors.steel[0]} mr={'sm'}>
              Question
            </Text>
          </Group>
          <Text c={theme.colors.steel[4]} mb={'md'}>
            How do you think our organization can improve stakeholder engagement
            in its governance structure?
          </Text>

          <Group gap="sm">
            <Button
              size="xs"
              variant="secondary"
              leftSection={<IconSearch size={14} />}
            >
              Details
            </Button>
            <Button
              size="xs"
              variant="secondary"
              leftSection={<IconExternalLink size={14} />}
            >
              Poll Link
            </Button>
          </Group>
        </Paper>
        <Paper>
          <Text fw={600} c={theme.colors.steel[0]} mb="2px">
            Answer
          </Text>
          <Text c={theme.colors.steel[4]} fz="xs" mb="md">
            Adjust the sliders to distribute your vote
          </Text>
          <Stack gap={'xl'}>
            {values.map((value, index) => (
              <Box>
                <Group mb="xs" align="start" gap={'xs'}>
                  <ColorSwatch
                    color={value.color}
                    size={16}
                    style={{ transform: 'translateY(2.5px)' }}
                  />
                  <Text fw={500}>{value.label}</Text>
                </Group>
                <Group gap={0}>
                  <Text w={'10%'} fz="sm">
                    {value.value}%
                  </Text>
                  <Box w="90%">
                    <Slider
                      label={`${value.label} (${value.value}%)`}
                      value={value.value}
                      onChange={(newValue) =>
                        handleSliderChange(index, newValue)
                      }
                      max={100}
                      min={0}
                      color={value.color}
                    />
                  </Box>
                </Group>
              </Box>
            ))}
          </Stack>
        </Paper>
        <Paper>
          <Box>
            <Text fw={400} c={theme.colors.steel[2]} mb="xs" fz="sm">
              Total allocated: {totalAllocated}%
            </Text>
            <Text c={theme.colors.steel[2]} fz="sm">
              Remaining: {100 - totalAllocated}%
            </Text>
          </Box>
        </Paper>
      </Stack>
      <Button>Submit</Button>
    </CenterLayout>
  );
};
