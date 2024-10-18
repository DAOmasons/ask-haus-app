import {
  Box,
  Button,
  Paper,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { ChoiceRepeater, FormChoice } from './ChoiceRepeater';
import { CreatePoll1Values, CreatePoll2Values } from '../../schema/form/create';
import { VoteCard } from '../Cards';
import { useMemo } from 'react';
import { dateToSeconds, Times } from '../../utils/time';

export const CreatePoll2 = ({
  prevForm,
  form,
}: {
  prevForm: CreatePoll1Values;
  form: CreatePoll2Values;
}) => {
  const handleAddChoice = (choice: FormChoice) => {
    form.setFieldValue('choices', [...form.values.choices, choice]);
  };

  const handleDeleteChoice = (choice: FormChoice) => {
    form.setFieldValue(
      'choices',
      form.values.choices.filter((c) => c.id !== choice.id)
    );
  };

  const handleEditChoice = (choice: FormChoice) => {
    form.setFieldValue(
      'choices',
      form.values.choices.map((c) => {
        if (c.id === choice.id) {
          return choice;
        }
        return c;
      })
    );
  };

  const handleColorChange = (choice: FormChoice) => {
    form.setFieldValue(
      'choices',
      form.values.choices.map((c) => {
        if (c.id === choice.id) {
          return choice;
        }
        return c;
      })
    );
  };

  const endTime = useMemo(() => {
    if (!prevForm.values.time) {
      return 0;
    }

    if (prevForm.values.time !== 'Custom') {
      const length = Times[prevForm.values.time as keyof typeof Times];
      return Math.floor((Date.now() + length * 1000) / 1000);
    } else if (prevForm.values.customTimeEnd) {
      return dateToSeconds(prevForm.values.customTimeEnd);
    } else {
      return 0;
    }
  }, [prevForm]);

  return (
    <>
      <Stack w="100%" maw="500px" miw="350px" mb="xl" gap="lg">
        <Paper w="100%">
          <ChoiceRepeater
            choices={form.values.choices}
            onAdd={handleAddChoice}
            onColorChange={handleColorChange}
            onDelete={handleDeleteChoice}
            onEdit={handleEditChoice}
          />
        </Paper>
        <Paper>
          <Textarea
            label="Poll Description"
            placeholder="Optional."
            maxRows={10}
            description="Optional. Provide additional context about the poll."
            {...form.getInputProps('pollDescription')}
          />
        </Paper>
        <Paper>
          <TextInput
            label="Poll Link"
            placeholder="https://optional.com"
            description="Optional. Share a link to this poll with your voters."
            {...form.getInputProps('pollLink')}
          />
        </Paper>
        <Box>
          <Text fz="sm" lineClamp={1}>
            Preview
          </Text>
          <VoteCard
            title={prevForm.values.title}
            time={endTime}
            choices={form.values.choices}
            link={form.values.pollLink}
            description={form.values.pollDescription}
          />
        </Box>
      </Stack>
      <Button>Create Poll</Button>
    </>
  );
};
