import { Button } from '@mantine/core';
import {
  useAccount,
  useClient,
  usePublicClient,
  useWalletClient,
  useWriteContract,
} from 'wagmi';
import { ADDR } from '../constants/address';
import Factory from '../abi/FastFactory.json';
import { pollTestArgs } from '../utils/factory';

export const CreatePoll = () => {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const handleCreatePoll = async () => {
    if (!publicClient) return;

    const nowInSeconds = Math.floor(Date.now() / 1000);

    const pollArgs = pollTestArgs(BigInt(nowInSeconds) - 1n);

    // const { request } = await publicClient.simulateContract();

    const hash = await walletClient?.writeContract({
      account: address,
      address: ADDR.FACTORY,
      abi: Factory,
      functionName: 'buildContest',
      args: pollArgs,
    });

    if (hash) {
      console.log(hash);
    }
  };

  return <Button onClick={handleCreatePoll}> Create Poll</Button>;
};
