import {
  ActionIcon,
  ColorPicker,
  ColorSwatch,
  Group,
  HoverCard,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { IconList, IconPlus } from '@tabler/icons-react';
import {
  generateRandomBytes32,
  generateRandomHexColor,
} from '../../utils/helpers';

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
  const [targetChoice, setTargetChoice] = useInputState('');
  return (
    <Stack gap={'sm'} w="100%">
      <Text fw={600}>Choices</Text>
      {choices.map((choice) => (
        <Group key={`${choice.id}`} gap={8}>
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
          <Text>{choice.title}</Text>
        </Group>
      ))}
      <TextInput
        placeholder="Other"
        mb={'sm'}
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
    </Stack>
  );
};
