import { Box, Button, Title } from '@mantine/core';
import { useTx } from '../hooks/useTx';
import { CenterLayout } from '../layout/Layout';
import { BigTitle } from '../components/Typography';

export const Home = () => {
  const { openModal, closeModal } = useTx();

  return (
    <CenterLayout>
      <Box style={{ containerType: 'inline-size' }}>
        <BigTitle>ask.haus</BigTitle>
        <Button onClick={openModal}>Test Modal</Button>
      </Box>
    </CenterLayout>
  );
};
