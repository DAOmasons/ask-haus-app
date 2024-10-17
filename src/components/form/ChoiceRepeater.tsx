import {
  ActionIcon,
  Box,
  Button,
  ColorPicker,
  ColorSwatch,
  Flex,
  Group,
  HoverCard,
  Modal,
  Stack,
  Text,
  Textarea,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useInputState } from '@mantine/hooks';
import {
  IconDeviceFloppy,
  IconEdit,
  IconLink,
  IconMessage,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import {
  generateRandomBytes32,
  generateRandomHexColor,
  isValidOptionalUrl,
} from '../../utils/helpers';
import { TextButton } from '../Typography';

export type FormChoice = {
  id: string;
  title: string;
  description?: string;
  link?: string;
  color: string;
};

type ChoiceRepeaterProps = {
  choices: FormChoice[];
  onAdd: (choice: FormChoice) => void;
  onColorChange: (newChoice: FormChoice) => void;
  onDelete: (choice: FormChoice) => void;
  onEdit: (newChoice: FormChoice) => void;
};
export const ChoiceRepeater = ({
  choices,
  onAdd,
  onColorChange,
  onDelete,
  onEdit,
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
      <Text fw={600}>Choices</Text>
      {choices.map((choice) => (
        <Flex key={`${choice.id}`} gap={12} align={'start'}>
          <HoverCard openDelay={200} closeDelay={300}>
            <HoverCard.Target>
              <ColorSwatch color={choice.color} size={18} mt={2} />
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <ColorPicker
                value={choice.color}
                onChange={(color) => onColorChange({ ...choice, color })}
              />
            </HoverCard.Dropdown>
          </HoverCard>

          <TextButton
            onClick={() => handleOpen(choice)}
            ta="left"
            style={{ flex: 1 }}
          >
            {choice.title}
          </TextButton>

          <Group gap={2} style={{ transform: 'translateY(-4px)' }}>
            {choice.description && (
              <HoverCard openDelay={200} closeDelay={300}>
                <HoverCard.Target>
                  <ActionIcon
                    radius={999}
                    onClick={() => {
                      handleOpen(choice);
                    }}
                    variant="ghost-icon"
                  >
                    <IconMessage size={18} color={theme.colors.steel[4]} />
                  </ActionIcon>
                </HoverCard.Target>
                <HoverCard.Dropdown maw={450}>
                  <Text mb="sm">{choice.description}</Text>
                </HoverCard.Dropdown>
              </HoverCard>
            )}

            {choice.link && (
              <ActionIcon
                radius={999}
                component="a"
                href={choice.link}
                target="_blank"
                rel="noreferrer"
                variant="ghost-icon"
              >
                <IconLink size={18} color={theme.colors.steel[4]} />
              </ActionIcon>
            )}

            <ActionIcon
              radius={999}
              onClick={() => {
                handleOpen(choice);
              }}
              variant="ghost-icon"
            >
              <IconEdit
                size={14}
                color={theme.colors.steel[4]}
                onClick={() => {
                  handleOpen(choice);
                }}
              />
            </ActionIcon>
          </Group>
        </Flex>
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
      <EditChoiceModal
        key={selectedChoice?.id}
        opened={opened}
        handleClose={handleClose}
        selectedChoice={selectedChoice}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </Stack>
  );
};

const EditChoiceModal = ({
  opened,
  handleClose,
  selectedChoice,
  onEdit,
  onDelete,
}: {
  opened: boolean;
  selectedChoice: FormChoice | null;
  handleClose: () => void;
  onEdit: (newChoice: FormChoice) => void;
  onDelete: (choice: FormChoice) => void;
}) => {
  const [newTitle, setNewTitle] = useInputState(selectedChoice?.title || '');
  const [newDescription, setNewDescription] = useInputState(
    selectedChoice?.description ?? ''
  );
  const [newLink, setNewLink] = useInputState(selectedChoice?.link ?? '');

  if (!selectedChoice) {
    return null;
  }

  return (
    <Modal opened={opened} onClose={handleClose} title="Edit Choice" centered>
      <Stack gap="lg" mb={'lg'}>
        <TextInput
          label="Choice Title"
          value={newTitle}
          onChange={setNewTitle}
        />
        <Textarea
          label={'Choice Description'}
          value={newDescription}
          minRows={4}
          onChange={setNewDescription}
          description="Optional description"
        />
        <TextInput
          label={'Choice Link'}
          value={newLink}
          onChange={setNewLink}
          description="Optional link"
          placeholder="https://example.com"
          error={isValidOptionalUrl(newLink) ? undefined : 'Invalid URL'}
        />
      </Stack>
      <Group justify="space-between">
        <Button
          size="sm"
          leftSection={<IconTrash size={18} />}
          variant="danger"
          onClick={() => {
            onDelete(selectedChoice!);
            handleClose();
          }}
        >
          Discard
        </Button>
        <Button
          size="sm"
          leftSection={<IconDeviceFloppy size={18} />}
          onClick={() => {
            onEdit({
              ...selectedChoice,
              title: newTitle,
              description: newDescription,
              link: newLink,
            });
            handleClose();
          }}
        >
          Save
        </Button>
      </Group>
    </Modal>
  );
};
