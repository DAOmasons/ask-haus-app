import { Box, Paper, Stack, Text, Textarea, TextInput } from '@mantine/core';
import { ChoiceRepeater, FormChoice } from './ChoiceRepeater';
import { CreatePoll2Values } from '../../schema/form/create';
import { VoteCard } from '../Cards';

export const CreatePoll2 = ({
  pollTitle,
  pollTime,
  form,
}: {
  pollTitle: string;
  form: CreatePoll2Values;
  pollTime: string;
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

  return (
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
          title={pollTitle}
          time={(60 * 60 * 24).toString()}
          choices={form.values.choices}
          link={form.values.pollLink}
          description={form.values.pollDescription}
        />
      </Box>
    </Stack>
  );
};
