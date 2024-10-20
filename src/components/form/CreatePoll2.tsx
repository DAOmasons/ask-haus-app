import {
  Paper,
  Stack,
  Text,
  Textarea,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { ChoiceRepeater } from './ChoiceRepeater';
import { CreatePoll2Values } from '../../schema/form/create';
import { TxButton } from '../TxButton';
import { FormChoice } from '../../types/ui';

export const CreatePoll2 = ({
  form,
  handleSubmit,
  lessThanTwoChoices,
}: {
  //   prevForm: CreatePoll1Values;
  form: CreatePoll2Values;
  lessThanTwoChoices: boolean | undefined;
  handleSubmit: () => void;
}) => {
  const theme = useMantineTheme();

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
        {lessThanTwoChoices === true && (
          <Text c={theme.colors.red[6]} fz="sm">
            Must have at least 2 choices
          </Text>
        )}
      </Stack>
      <TxButton onClick={handleSubmit} disabled={lessThanTwoChoices === true}>
        Create Poll
      </TxButton>
    </>
  );
};
