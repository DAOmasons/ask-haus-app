import {
  ActionIcon,
  Box,
  Button,
  ColorSwatch,
  Flex,
  Group,
  Paper,
  Slider,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { CenterLayout } from '../layout/Layout';
import { useState } from 'react';
import {
  BigTitle,
  SectionText,
  SubTitle,
  TextButton,
} from '../components/Typography';
import {
  IconExternalLink,
  IconEye,
  IconLink,
  IconSearch,
  IconZoomIn,
} from '@tabler/icons-react';

export const My = () => {
  return (
    <CenterLayout>
      <Box w="100%" maw={500}>
        <ExampleTwo />
      </Box>
    </CenterLayout>
  );
};

const ExampleOne = () => {
  const [values, setValues] = useState([
    { color: 'chocolate', value: 0, label: 'Chocolate' },
    { color: 'pink', value: 0, label: 'Strawberry' },
    { color: 'white', value: 0, label: 'Vanilla' },
    { color: 'green', value: 0, label: 'Mint Chip' },
  ]);

  const handleChange = (newValue: number, index: number) => {
    // Round to 1 decimal place to avoid floating point issues
    newValue = Math.round(newValue * 10) / 10;

    setValues((prevValues) => {
      const updatedValues = [...prevValues];

      // Calculate the current total excluding the changed slider
      const currentTotal = prevValues.reduce(
        (sum, item, i) => (i === index ? sum : sum + item.value),
        0
      );

      // Calculate how much room we have left
      const availableSpace = 100 - currentTotal;

      // If new value would exceed 100% total
      if (newValue > availableSpace) {
        // Calculate how much we need to reduce other values
        const excess = newValue - availableSpace;

        // Get sum of other non-zero values
        const otherValuesSum = currentTotal;

        if (otherValuesSum > 0) {
          // Reduce other values proportionally
          updatedValues.forEach((item, i) => {
            if (i !== index && item.value > 0) {
              const proportion = item.value / otherValuesSum;
              const reduction = excess * proportion;
              // Round to 1 decimal place
              item.value = Math.round((item.value - reduction) * 10) / 10;
              // Ensure we don't go below 0 due to rounding
              item.value = Math.max(0, item.value);
            }
          });
        }
        // Set the new value to whatever space was available
        updatedValues[index].value = Math.min(100, newValue);
      } else {
        // If we're not exceeding 100%, just set the new value
        updatedValues[index].value = newValue;
      }

      // Final check to ensure total doesn't exceed 100 due to rounding
      const finalTotal = updatedValues.reduce(
        (sum, item) => sum + item.value,
        0
      );
      if (finalTotal > 100) {
        const excess = finalTotal - 100;
        updatedValues[index].value -= excess;
      }

      return updatedValues;
    });
  };

  return (
    <Stack gap={'xl'}>
      {values.map((value, index) => (
        <Slider
          key={index}
          label={value.label}
          color={value.color}
          value={value.value}
          onChange={(newValue) => handleChange(newValue, index)}
        />
      ))}
    </Stack>
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
        <SubTitle mb="sm">Poll</SubTitle>
        <Text c={theme.colors.steel[4]} fz="sm">
          Ends In 1d 1h 1m 1s
        </Text>
      </Box>
      <Stack w="100%" maw={500} gap={'xl'} mb="xl">
        <Paper>
          <Group mb="sm" gap="0">
            <Text fw={600} c={theme.colors.steel[0]} mr={'sm'}>
              Question
            </Text>
          </Group>
          <Text c={theme.colors.steel[4]} mb={'sm'}>
            How do you think our organization can improve stakeholder engagement
            in its governance structure?
          </Text>

          <Group gap="sm">
            <Button
              size="xs"
              variant="secondary"
              leftSection={<IconEye size={14} />}
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
            <Text fw={400} c={theme.colors.steel[2]} mb="sm">
              Total allocated: {totalAllocated}%
            </Text>
            <Text c={theme.colors.steel[2]}>
              Remaining: {100 - totalAllocated}%
            </Text>
          </Box>
        </Paper>
      </Stack>
      <Button>Submit</Button>
    </CenterLayout>
  );
};
