import { Box, InputDescription, InputError, InputLabel } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ReactNode, useMemo } from 'react';
import tiptapClasses from '../styles/tiptap.module.css';

type TextBossProps = {
  label?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  error?: ReactNode;
  description?: ReactNode;
};

export const TextBoss = (props: TextBossProps) => {
  const { label, required, error, description } = props;

  const editor = useEditor({
    extensions: [StarterKit],
    content: [],
  });

  // tiptap editor is not re-rendering when props change
  const updateKey = useMemo(() => {
    return JSON.stringify(props);
  }, [props]);

  const inputError = useMemo(() => {
    if (!error) return undefined;

    if (typeof error === 'string') {
      return <InputError>{error}</InputError>;
    }
    return error;
  }, [error]);

  const inputDescription = useMemo(() => {
    if (!description) return undefined;

    if (typeof description === 'string') {
      return <InputDescription mt={4}>{description}</InputDescription>;
    }
    return description;
  }, [description]);

  return (
    <Box key={updateKey}>
      {label && <InputLabel required={required}>{label}</InputLabel>}
      {inputError}
      <RichTextEditor
        editor={editor}
        classNames={{
          root: tiptapClasses.root,
          content: tiptapClasses.content,
        }}
      >
        <RichTextEditor.Content />
      </RichTextEditor>
      {inputDescription}
    </Box>
  );
};
