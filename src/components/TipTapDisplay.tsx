import React from 'react';
import { Content, useEditor } from '@tiptap/react';
import { Link, RichTextEditor } from '@mantine/tiptap';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import tiptapClasses from '../styles/tiptap.module.css';

export const TipTapDisplay = ({ content }: { content: Content }) => {
  const editor = useEditor({
    extensions: [Link, StarterKit, Underline],
    editable: false,
    content,
  });

  return (
    <RichTextEditor
      editor={editor}
      classNames={{
        root: tiptapClasses.rootDisplay,
        content: tiptapClasses.contentDisplay,
      }}
    >
      <RichTextEditor.Content p={0} />
    </RichTextEditor>
  );
};
