import { Button, Paper, Stack, Textarea, TextInput } from '@mantine/core';
import { ChoiceRepeater, FormChoice } from './ChoiceRepeater';
import { CreatePoll2Values } from '../../schema/form/create';

export const CreatePoll2 = ({
  form,
  handleSubmit,
}: {
  //   prevForm: CreatePoll1Values;
  form: CreatePoll2Values;
  handleSubmit: () => void;
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
      </Stack>
      <Button onClick={handleSubmit}>Create Poll</Button>
    </>
  );
};
