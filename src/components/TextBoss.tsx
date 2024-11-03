import { Box, InputLabel } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export const TextBoss = ({ label }: { label?: string; required?: boolean }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: [],
  });

  return (
    <Box>
      {label && <InputLabel>{label}</InputLabel>}
      <RichTextEditor editor={editor}>
        <RichTextEditor.Content />
      </RichTextEditor>
    </Box>
  );
};
