import { Address } from 'viem';
import { publicClient } from '../utils/connect';
import BaalPoints from '../abi/BaalPoints.json';

export const getUserPoints = ({
  userAddress,
  pointsAddress,
}: {
  userAddress: Address;
  pointsAddress: Address;
}) => {
  const points = publicClient.readContract({
    address: pointsAddress,
    functionName: 'getPoints',
    args: [userAddress],
    abi: BaalPoints,
  });

  return points;
};
