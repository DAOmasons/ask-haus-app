import {
  Box,
  Flex,
  Group,
  Modal,
  Spoiler,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconFidgetSpinner,
  IconHourglass,
  IconHourglassHigh,
  IconSkull,
} from '@tabler/icons-react';
import { createContext, useMemo, useState } from 'react';
import classes from '../styles/animation.module.css';

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
  const { colors } = useMantineTheme();
  const [opened, { open, close }] = useDisclosure();

  const state = 'error';

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
        <ErrorState title="Transaction Failed" description="Please try again" />
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

export const LoadingState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <Flex align={'center'} mt="md" direction={'column'}>
      <IconFidgetSpinner size={60} className={classes.spinGlow} />
      <Text fz="lg" my="md" className={classes.glow} fw={600}>
        {title}
      </Text>
      <Text pb="xl" className={classes.glow}>
        {description}
      </Text>
    </Flex>
  );
};

export const ErrorState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <Flex align={'center'} mt="md" direction={'column'}>
      <IconSkull size={60} />
      <Text fz="lg" my="md" fw={600}>
        {title}
      </Text>
      <Text pb="xl">{description}</Text>
      <Spoiler
        showLabel={<Text fz={'xs'}>read more</Text>}
        hideLabel={<Text fz="xs">hide</Text>}
        fz="sm"
        className="ws-pre-wrap"
        maw={'80%'}
      >
        {pretendError}
      </Spoiler>
    </Flex>
  );
};

// generate a long sample error message

const pretendError =
  'Error: Something went wrong. Please try again later. If the error persists, please contact us at 0x0000000000000000000000000000000000000000 and we will help you solve the issue. Thank you for your patience. More details: 0x0000000000000000000000000000000000000000 even more text here. More and more ';
