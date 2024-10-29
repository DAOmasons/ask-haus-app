import { useQuery } from '@tanstack/react-query';
import { isAddress } from 'viem';

export const useBaalPoints = ({
  userAddress,
  pointsAddress,
}: {
  userAddress?: string;
  pointsAddress?: string;
}) => {
  const {} = useQuery({
    queryKey: ['baalPoints', userAddress, pointsAddress],
    queryFn: async () => {},
    enabled: !!userAddress && !!pointsAddress,
  });
  if (userAddress && isAddress(userAddress)) {
    console.warn('userAddress is not an address');

    return {
      data: null,
      isLoading: false,
      error: new Error('userAddress is not an address'),
    };
  }

  if (pointsAddress && isAddress(pointsAddress)) {
    console.warn('pointsAddress is not an address');

    return {
      data: null,
      isLoading: false,
      error: new Error('pointsAddress is not an address'),
    };
  }

  return { points };
};
