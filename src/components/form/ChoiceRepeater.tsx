import {
  ActionIcon,
  Button,
  ColorPicker,
  ColorSwatch,
  Group,
  HoverCard,
  Modal,
  Paper,
  Stack,
  Text,
  Textarea,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useInputState } from '@mantine/hooks';
import {
  IconDeviceFloppy,
  IconList,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import {
  generateRandomBytes32,
  generateRandomHexColor,
} from '../../utils/helpers';
import { TextButton } from '../Typography';

export type FormChoice = {
  id: string;
  title: string;
  description?: string;
  color: string;
};

type ChoiceRepeaterProps = {
  choices: FormChoice[];
  onAdd: (choice: FormChoice) => void;
  onColorChange: (newChoice: FormChoice) => void;
};
export const ChoiceRepeater = ({
  choices,
  onAdd,
  onColorChange,
}: ChoiceRepeaterProps) => {
  const theme = useMantineTheme();
  const [targetChoice, setTargetChoice] = useInputState('');
  const [opened, { open, close }] = useDisclosure();
  const [selectedChoice, setSelectedChoice] = useInputState<FormChoice | null>(
    null
  );

  const handleOpen = (choice: FormChoice) => {
    setSelectedChoice(choice);
    open();
  };

  const handleClose = () => {
    setSelectedChoice(null);
    close();
  };
  return (
    <Stack gap={'sm'} w="100%">
      <Text fw={600} mb="sm">
        Choices
      </Text>
      {choices.map((choice) => (
        <Group key={`${choice.id}`} gap={12}>
          <HoverCard openDelay={200} closeDelay={300}>
            <HoverCard.Target>
              <ColorSwatch color={choice.color} h={24} w={24} />
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <ColorPicker
                onChange={(color) => onColorChange({ ...choice, color })}
              />
            </HoverCard.Dropdown>
          </HoverCard>
          <TextButton onClick={() => handleOpen(choice)}>
            {choice.title}
          </TextButton>
        </Group>
      ))}
      <TextInput
        placeholder="Other"
        my={'sm'}
        value={targetChoice}
        onChange={setTargetChoice}
      />
      <Group w={'100%'} justify="center">
        <ActionIcon
          radius={999}
          onClick={() => {
            setTargetChoice('');
            onAdd({
              id: generateRandomBytes32(),
              title: targetChoice,
              color: generateRandomHexColor(),
            });
          }}
          disabled={targetChoice === ''}
        >
          <IconPlus size={18} />
        </ActionIcon>
      </Group>
      <Modal opened={opened} onClose={handleClose} title="Edit Choice" centered>
        <Stack gap="lg" mb={'lg'}>
          <TextInput label="Choice Title" value={selectedChoice?.title} />
          <Textarea
            label={'Choice Description'}
            value={selectedChoice?.description}
            minRows={4}
          />
        </Stack>
        <Group justify="space-between">
          <Button
            size="sm"
            leftSection={<IconTrash size={18} />}
            variant="danger"
          >
            Discard
          </Button>
          <Button size="sm" leftSection={<IconDeviceFloppy size={18} />}>
            Save
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
};
