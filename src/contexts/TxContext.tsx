import { Group, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { createContext, useMemo } from 'react';
import {
  ErrorState,
  LoadingState,
  SuccessState,
} from '../components/ModalStates';

enum PollStatus {
  Idle,
  Polling,
  Error,
  Success,
  Timeout,
}

type TxContextType = {
  openModal: () => void;
  closeModal: () => void;
};

export const TxContext = createContext<TxContextType>({
  openModal: () => {},
  closeModal: () => {},
});

export const TxProvider = ({ children }: { children: React.ReactNode }) => {
  const [opened, { open, close }] = useDisclosure();

  const state = 'loading';

  const txModalContent = useMemo(() => {
    if (state === 'loading')
      return (
        <LoadingState
          title="Transaction in progress"
          description="Please wait..."
        />
      );

    if (state === 'error')
      return (
        <ErrorState
          title="Transaction Failed"
          description="Please try again"
          errMsg={''}
        />
      );

    if (state === 'success')
      return (
        <SuccessState
          title="Transaction Successful"
          description="Thank you for voting!"
        />
      );
  }, []);

  return (
    <TxContext.Provider
      value={{
        openModal: () => {
          console.log('open');
          open();
        },
        closeModal: close,
      }}
    >
      {children}
      <Modal.Root opened={opened} onClose={close} centered w={300}>
        <Modal.Overlay />
        <Modal.Content miw={300} maw={440}>
          <Group w="100%">
            <Modal.CloseButton />
          </Group>
          {txModalContent}
        </Modal.Content>
      </Modal.Root>
    </TxContext.Provider>
  );
};
