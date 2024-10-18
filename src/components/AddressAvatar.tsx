import {
  Avatar,
  Group,
  MantineSize,
  MantineSpacing,
  StyleProp,
  Text,
  Tooltip,
} from '@mantine/core';
import { ComponentProps } from 'react';
import { Address, isAddress } from 'viem';
import { useEnsAvatar, useEnsName } from 'wagmi';
import { mainnet } from 'viem/chains';
import { useClipboard } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { ensConfig } from '../utils/connect';

export const AddressAvatar = ({
  address,
  size = 24,
  onClick,
  fz,
  displayText = true,
  displayPfp = true,
  withTooltip = false,
  gap = 'sm',
  canCopy,
}: {
  address: Address;
  size?: MantineSize | number;
  fz?: StyleProp<number | MantineSize>;
  withTooltip?: boolean;
  displayText?: boolean;
  displayPfp?: boolean;
  hideText?: boolean;
  canCopy?: boolean;
  gap?: MantineSpacing;
  onClick?: () => void;
}) => {
  const { data: ensName } = useEnsName({
    address,
    config: ensConfig,
    chainId: mainnet.id,
  });

  const { copy } = useClipboard();

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName ? ensName : undefined,
    config: ensConfig,
    chainId: mainnet.id,
  });

  const name = ensName || address.slice(0, 6) + '...' + address.slice(-4);
  const imgUrl = ensAvatar || `https://effigy.im/a/${address}.svg`;

  return (
    <Group
      gap={gap}
      style={{
        cursor: canCopy || onClick ? 'pointer' : 'default',
      }}
      onClick={() => {
        if (onClick) {
          onClick();
          return;
        }

        if (canCopy) {
          copy(address);
          notifications.show({
            title: 'Address Copied',
            message: `Address: ${address} has been copied to clipboard`,
          });
        }
      }}
    >
      {!displayPfp ? null : withTooltip ? (
        <Tooltip
          label={ensName ? name : address}
          position="top"
          withArrow
          openDelay={200}
        >
          <Avatar src={imgUrl} size={size} />
        </Tooltip>
      ) : (
        <Avatar src={imgUrl} size={size} />
      )}
      {displayText && <Text fz={fz}>{name}</Text>}
    </Group>
  );
};

export const AddressAvatarGroup = ({
  addresses,
}: {
  avatarProps?: ComponentProps<typeof Avatar>;
  addresses: string[];
}) => {
  return (
    <Avatar.Group>
      {addresses.map((address) =>
        isAddress(address) ? (
          <AddressAvatar
            address={address}
            canCopy
            withTooltip
            key={address}
            displayText={false}
          />
        ) : null
      )}
    </Avatar.Group>
  );
};

export const AvatarGroupItem = ({
  address,
  avatarProps,
}: {
  address: string;
  avatarProps?: ComponentProps<typeof Avatar>;
}) => {
  const { data: ensName } = useEnsName({
    address: address as Address,
    config: ensConfig,
    chainId: mainnet.id,
  });

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName ? ensName : undefined,
    config: ensConfig,
    chainId: mainnet.id,
  });

  const imgUrl = ensAvatar || `https://effigy.im/a/${address}.svg`;

  return <Avatar src={imgUrl} {...(avatarProps || {})} />;
};
