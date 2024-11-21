import { Box, InputDescription, InputError, InputLabel } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';

import {
  useEditor,
  FloatingMenu,
  BubbleMenu,
  JSONContent,
  Content,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useMemo } from 'react';
import tiptapClasses from '../styles/tiptap.module.css';
import { emptyContent } from '../utils/tiptapUtils';

type TextBossProps = {
  label?: string;
  required?: boolean;
  value?: Content;
  onChange?: (value: JSONContent) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  description?: string;
};

export const TextBoss = (props: TextBossProps) => {
  const { label, required, error, description, placeholder, onChange, value } =
    props;

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Link,
        Underline,
        Placeholder.configure({ placeholder }),
      ],
      //   content: value || emptyContent,
      onUpdate(props) {
        if (onChange) {
          onChange(props.editor.getJSON());
        }
      },
      //   onUpdate: ({ editor, ...rest }) => {
      //     console.log('editor', editor);
      //     console.log('rest', rest);
      //   },
    },
    [placeholder]
  );

  // tiptap editor is not re-rendering when props change
  const updateKey = useMemo(() => {
    return JSON.stringify({ label, required, error, description });
  }, [label, required, error, description]);

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
        {editor && (
          <FloatingMenu editor={editor}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
            </RichTextEditor.ControlsGroup>
          </FloatingMenu>
        )}
        {editor && (
          <BubbleMenu editor={editor}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Link />
              <RichTextEditor.Underline />
            </RichTextEditor.ControlsGroup>
          </BubbleMenu>
        )}
        <RichTextEditor.Content />
      </RichTextEditor>
      {inputDescription}
    </Box>
  );
};
