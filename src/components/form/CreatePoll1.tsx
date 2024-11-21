import { Button, Paper, Select, Stack, TextInput } from '@mantine/core';
import { CreatePoll1Values } from '../../schema/form/create';
import { DateTimePicker } from '@mantine/dates';
import { Times } from '../../utils/time';
import { ChoiceInputType } from '../../constants/enum';

export const CreatePoll1 = ({
  form,
  advanceForm,
}: {
  form: CreatePoll1Values;
  advanceForm: () => void;
}) => {
  return (
    <>
      <Stack w="100%" maw="500px" miw="350px" mb="xl" gap="lg">
        <Paper>
          <TextInput
            required
            label="Question"
            placeholder="What is your favorite color?"
            description="What would you like to ask Public Haus?"
            {...form.getInputProps('title')}
          />
        </Paper>
        <Paper>
          <Select
            data={Object.values(ChoiceInputType)}
            label="Answer Type"
            required
            allowDeselect={false}
            description={
              form.values.answerType === 'Single Choice'
                ? 'Voters allocate 100% of their token on one choice'
                : form.values.answerType === 'Allocation (%)'
                  ? 'Voters can choose how much to allocate to each choice'
                  : 'Choose how voters respond to the poll'
            }
            {...form.getInputProps('answerType')}
          />
        </Paper>
        <Paper>
          <Select
            data={['Shares', 'Loot', 'Both']}
            label="Token Type"
            required
            allowDeselect={false}
            description={
              form.values.tokenType === 'Shares'
                ? 'Voters can vote with DAO shares (voting token)'
                : form.values.tokenType === 'Loot'
                  ? 'Voters can vote with DAO loot (non-voting token)'
                  : 'Voters can vote with both DAO tokens'
            }
            {...form.getInputProps('tokenType')}
          />
        </Paper>
        <Paper>
          <Select
            data={[...Object.keys(Times), 'Custom']}
            label="Voting Time"
            required
            allowDeselect={false}
            {...form.getInputProps('time')}
          />
        </Paper>

        {form.values.time === 'Custom' && (
          <>
            <Paper>
              <DateTimePicker
                label="Start"
                highlightToday
                clearable
                labelProps={{
                  fw: 400,
                  fz: 14,
                }}
                {...form.getInputProps('customTimeStart')}
                defaultValue={new Date()}
              />
            </Paper>
            <Paper>
              <DateTimePicker
                label="End"
                clearable
                labelProps={{
                  fw: 400,
                  fz: 14,
                }}
                {...form.getInputProps('customTimeEnd')}
              />
            </Paper>
          </>
        )}
      </Stack>
      <Button onClick={advanceForm} disabled={!form.isValid()}>
        Next
      </Button>
    </>
  );
};
