import { useQuery } from '@tanstack/react-query';
import { Address, formatEther, isAddress } from 'viem';
import { getUserPoints } from '../queries/baalPoints';

export const useBaalPoints = ({
  userAddress,
  pointsAddress,
}: {
  userAddress?: string;
  pointsAddress?: string;
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['baalPoints', userAddress, pointsAddress],
    queryFn: async () =>
      getUserPoints({
        userAddress: userAddress as Address,
        pointsAddress: pointsAddress as Address,
      }),
    enabled: !!userAddress && !!pointsAddress,
  });
  if (userAddress && !isAddress(userAddress)) {
    console.warn('userAddress is not an address');

    return {
      data: null,
      isLoading: false,
      error: new Error('userAddress is not an address'),
    };
  }

  if (pointsAddress && !isAddress(pointsAddress)) {
    console.warn('pointsAddress is not an address');

    return {
      data: null,
      isLoading: false,
      error: new Error('pointsAddress is not an address'),
    };
  }

  return {
    points: data,
    pointsDisplay: typeof data === 'bigint' ? formatEther(data) : undefined,
    isLoading,
    error,
  };
};
