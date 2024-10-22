import { Box, Slider, Stack } from '@mantine/core';
import { CenterLayout } from '../layout/Layout';
import { useCallback, useState } from 'react';

export const My = () => {
  return (
    <CenterLayout>
      <Stack w="100%" maw={500} gap={100}>
        <ExampleOne />
        <ExampleTwo />
      </Stack>
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
      const oldValue = updatedValues[index].value;

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
      <Box w="100%" maw={500}>
        <Stack gap={'xl'}>
          {values.map((value, index) => (
            <Slider
              key={index}
              label={`${value.label} (${value.value}%)`}
              value={value.value}
              onChange={(newValue) => handleSliderChange(index, newValue)}
              max={100}
              min={0}
              color={value.color}
            />
          ))}
          <Box>
            Total allocated: {totalAllocated}%
            <br />
            Remaining: {100 - totalAllocated}%
          </Box>
        </Stack>
      </Box>
    </CenterLayout>
  );
};
