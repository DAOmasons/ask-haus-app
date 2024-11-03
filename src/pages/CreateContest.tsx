import { CenterLayout } from '../layout/Layout';
import { Box, InputLabel, Paper, Stack, TextInput } from '@mantine/core';
import { SubTitle } from '../components/Typography';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useTx } from '../hooks/useTx';
import { useEditor } from '@tiptap/react';
import { RichTextEditor } from '@mantine/tiptap';
import { useState } from 'react';
import StarterKit from '@tiptap/starter-kit';

export const CreateContest = () => {
  const { tx } = useTx();
  const navigate = useNavigate();
  const location = useLocation();
  const formIndex = location.pathname.split('/').slice(-1)[0];
  const [contestTag, setContestTag] = useState<string | undefined>();

  return (
    <CenterLayout>
      <Box w="100%" maw="500px" miw="350px" mb="xl">
        <SubTitle>Create Contest</SubTitle>
      </Box>
      <Routes>
        <Route path="0" element={<Form1 />} />
        <Route path="1" element={<Form2 />} />
        <Route path="2" element={<FormComplete />} />
        <Route path="*" element={<Navigate to="0" replace />} />
      </Routes>
    </CenterLayout>
  );
};

const Form1 = () => {
  return (
    <Stack w="100%" maw="500px" miw="350px" mb="xl" gap="lg">
      <Paper>
        <TextInput
          required
          label="Contest Title"
          placeholder="What is the best way to skin a cat?"
        />
      </Paper>
      <Paper>
        <TextBoss />
      </Paper>
    </Stack>
  );
};

const Form2 = () => {
  return <></>;
};

const FormComplete = () => {
  return <> </>;
};

const TextBoss = ({ label }: { label?: string; required?: boolean }) => {
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
