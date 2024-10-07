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
import { charLimit } from '../utils/helpers';

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
        <ErrorState
          title="Transaction Failed"
          description="Please try again"
          errMsg={pretendError}
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
  errMsg,
}: {
  title: string;
  description: string;
  errMsg?: string;
}) => {
  const { colors } = useMantineTheme();
  return (
    <Flex align={'center'} mt="md" direction={'column'}>
      <IconSkull size={60} />
      <Text fz="lg" my="md" fw={600}>
        {title}
      </Text>
      <Text pb="xl">{description}</Text>
      {errMsg && (
        <Spoiler
          showLabel={
            <Text fz={'xs'} c={colors.steel[2]}>
              Read Error
            </Text>
          }
          hideLabel={
            <Text fz="xs" c={colors.steel[3]}>
              Hide
            </Text>
          }
          fz="sm"
          className="ws-pre-wrap"
          w={'80%'}
          maxHeight={0}
        >
          {charLimit(errMsg, 1000)}
        </Spoiler>
      )}
    </Flex>
  );
};

// generate a long sample error message

const pretendError =
  'Error: Something went wrong. Please try again later. If the error persists, please contact us at 0x0000000000000000000000000000000000000000 and we will help you solve the issue. Thank you for your patience. More details: 0x0000000000000000000000000000000000000000 even more text here. More and more ';
