import { useState } from 'react';
import { useTx } from '../../hooks/useTx';
import { useForm, zodResolver } from '@mantine/form';
import { emptyContent } from '../../utils/tiptapUtils';
import { notifications } from '@mantine/notifications';
import { generateRandomBytes32 } from '../../utils/helpers';
import {
  detailedChoiceFormSchema,
  detailedChoiceSchema,
} from '../../schema/form/create';
import { Address, encodeAbiParameters, parseAbiParameters } from 'viem';
import BaalGateAbi from '../../abi/BaalGate.json';
import {
  Box,
  Button,
  ColorPicker,
  ColorSwatch,
  Group,
  HoverCard,
  InputLabel,
  Paper,
  Stack,
  TextInput,
} from '@mantine/core';
import { SectionText } from '../Typography';
import { TextBoss } from '../TextBoss';
import { TxButton } from '../TxButton';

export const ChoiceCreate = ({
  choiceAddress,
  refetch,
}: {
  choiceAddress?: string;
  refetch?: () => void;
}) => {
  const [displayForm, setDisplayForm] = useState(false);
  const { tx } = useTx();

  const form = useForm({
    initialValues: {
      title: '',
      description: emptyContent,
      link: '',
      color: '',
    },
    validate: zodResolver(detailedChoiceFormSchema),
    validateInputOnBlur: true,
  });

  const handleChoiceCreate = async () => {
    if (!choiceAddress) {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Choice address not found',
      });
      return;
    }
    const choiceId = generateRandomBytes32();

    const validated = detailedChoiceSchema.safeParse({
      id: choiceId,
      ...form.values,
    });

    if (!validated.success) {
      notifications.show({
        color: 'red',
        title: 'Validation Error',
        message: 'Please check your choice data',
      });
      return;
    }

    const data = encodeAbiParameters(
      parseAbiParameters('bytes, (uint256,string)'),
      ['0x', [6969420n, JSON.stringify(validated.data)]]
    );

    tx({
      writeContractParams: {
        abi: BaalGateAbi,
        address: choiceAddress as Address,
        functionName: 'registerChoice',
        args: [choiceId, data],
      },
      writeContractOptions: {
        onPollSuccess() {
          setDisplayForm(false);
          refetch?.();
        },
      },
    });
  };

  return (
    <>
      {displayForm && (
        <Box>
          <SectionText>Create Choice</SectionText>
          <Paper>
            <Stack>
              <Group align="center">
                <InputLabel h={18} required>
                  Choice Color
                </InputLabel>
                <HoverCard openDelay={200} closeDelay={300}>
                  <HoverCard.Target>
                    <ColorSwatch color={form.values.color} />
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <ColorPicker
                      value={form.values.color}
                      onChange={(color) => form.setFieldValue('color', color)}
                    />
                  </HoverCard.Dropdown>
                </HoverCard>
              </Group>
              <TextInput
                label="Choice Title"
                placeholder="Name for your choice"
                description="There must be at least two choices"
                required
                {...form.getInputProps('title')}
              />
              <TextBoss
                label="Choice Description"
                placeholder="Write your description here"
                required
                {...form.getInputProps('description')}
              />
              <TextInput
                label="Choice Link"
                placeholder="https://example.com"
                {...form.getInputProps('link')}
              />
            </Stack>
          </Paper>
        </Box>
      )}

      <Group justify="center">
        {!displayForm ? (
          <Button onClick={() => setDisplayForm(true)}>Create Choice</Button>
        ) : (
          <TxButton onClick={handleChoiceCreate} disabled={!form.isValid()}>
            Submit Choice
          </TxButton>
        )}
      </Group>
    </>
  );
};
