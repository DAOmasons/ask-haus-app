import { Button } from '@mantine/core';
import { useTx } from '../hooks/useTx';

export const Home = () => {
  const { openModal, closeModal } = useTx();

  return <Button onClick={openModal}>Test Modal</Button>;
};
