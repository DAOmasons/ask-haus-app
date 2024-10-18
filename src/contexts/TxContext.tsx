import { Group, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { createContext, useCallback, useMemo, useState } from 'react';
import {
  ErrorState,
  LoadingState,
  SuccessState,
} from '../components/ModalStates';
import { Config, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import {
  WaitForTransactionReceiptErrorType,
  WriteContractErrorType,
} from 'viem';
import { WriteContractMutate } from 'wagmi/query';
import { pollEnvio } from '../utils/indexer';

type WriteContractParams = Parameters<
  ReturnType<typeof useWriteContract>['writeContract']
>[0];
type WriteContractOptions = Parameters<
  ReturnType<typeof useWriteContract>['writeContract']
>[1] & {
  onPollSuccess?: () => void;
  onPollError?: () => void;
  onPollTimeout?: () => void;
};

enum PollStatus {
  Idle,
  Polling,
  Error,
  Success,
  Timeout,
}

type ViewParams = {
  awaitEnvioPoll?: boolean;
  loading?: {
    title?: string;
    description?: string;
  };
  polling?: {
    title?: string;
    description?: string;
  };
  success?: {
    title?: string;
    description?: string;
    shouldCloseAfterButton?: boolean;
  };
  error?: {
    title?: string;
    fallback?: string;
  };
  successButton?: {
    label: string;
    onClick: () => void;
  };
};

type TxContextType = {
  tx: (params: {
    writeContractParams: WriteContractParams;
    writeContractOptions?: WriteContractOptions;
    viewParams?: ViewParams;
    onComplete?: () => void;
    onError?: (error: WriteContractErrorType) => void;
  }) => void;
  writeContract: WriteContractMutate<Config, unknown>;
  isAwaitingSignature: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  isError: boolean;
  txHash?: string;
  isIdle: boolean;
  txError: WaitForTransactionReceiptErrorType | null;
  error: WriteContractErrorType | null;
  txData: ReturnType<typeof useWaitForTransactionReceipt>['data'];
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const TxContext = createContext<TxContextType | undefined>(undefined);

export const TxProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    isPending: isAwaitingSignature,
    data: hash,
    writeContract,
    isError,
    reset,
    error,
    isIdle,
  } = useWriteContract();

  const {
    isSuccess: isConfirmed,
    isLoading: isConfirming,
    error: txError,
    isError: waitError,
    data: txData,
  } = useWaitForTransactionReceipt({
    hash: hash,
  });
  const [opened, { open, close }] = useDisclosure();
  const [viewParams, setViewParams] = useState<ViewParams | undefined>(
    undefined
  );
  const [pollStatus, setPollStatus] = useState(PollStatus.Idle);

  const clearTx = useCallback(() => {
    reset();
    setViewParams(undefined);
  }, [reset, setViewParams]);

  const handleClose = useCallback(() => {
    clearTx();
    close();
    setPollStatus(PollStatus.Idle);
  }, [clearTx, close]);

  const tx = ({
    viewParams,
    writeContractParams,
    writeContractOptions,
    onComplete,
    onError,
  }: {
    writeContractParams: WriteContractParams;
    writeContractOptions?: WriteContractOptions;
    viewParams?: ViewParams;
    onError?: (error: WriteContractErrorType) => void;
    onComplete?: () => void;
  }) => {
    open();
    writeContract(writeContractParams, {
      ...writeContractOptions,
      onSuccess: (data, variables, context) => {
        writeContractOptions?.onSuccess?.(data, variables, context);
        if (viewParams?.awaitEnvioPoll !== false && data) {
          setPollStatus(PollStatus.Polling);
          pollEnvio({
            txHash: data,
            onPollSuccess: () => {
              writeContractOptions?.onPollSuccess?.();
              setPollStatus(PollStatus.Success);
              onComplete?.();
            },
            onPollError: () => {
              writeContractOptions?.onPollError?.();
              setPollStatus(PollStatus.Error);
            },
            onPollTimeout: () => {
              writeContractOptions?.onPollTimeout?.();
              setPollStatus(PollStatus.Timeout);
            },
          });
        } else {
          onComplete?.();
        }
      },
      onError: (error, variables, context) => {
        console.error('error', error);
        onError?.(error as WriteContractErrorType);
        writeContractOptions?.onError?.(error, variables, context);
      },
    });
    setViewParams(viewParams);
  };

  const shouldWaitForPoll =
    viewParams?.awaitEnvioPoll !== false && pollStatus === PollStatus.Polling;

  const txModalContent = useMemo(() => {
    if (isConfirming || isAwaitingSignature || shouldWaitForPoll)
      return (
        <LoadingState
          title="Transaction in progress"
          description="Please wait..."
        />
      );

    if (isError || waitError)
      return (
        <ErrorState
          title="Transaction Failed"
          description="Please try again"
          errMsg={error?.message}
        />
      );

    if (pollStatus === PollStatus.Timeout) {
      return null;
    }

    if (isConfirmed)
      return (
        <SuccessState
          title="Transaction Successful"
          description="Thank you for voting!"
        />
      );
  }, [
    isConfirmed,
    waitError,
    isConfirming,
    isAwaitingSignature,
    isError,
    // hash,
    // viewParams,
    error,
    shouldWaitForPoll,
    pollStatus,
  ]);

  return (
    <TxContext.Provider
      value={{
        tx,
        isConfirmed,
        isConfirming,
        txHash: hash,
        writeContract,
        isError,
        isIdle,
        txError,
        txData,
        error: error as WriteContractErrorType | null,
        isAwaitingSignature,
        isModalOpen: opened,
        openModal: open,
        closeModal: handleClose,
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
