import { Box, HoverCard, Paper, Tooltip } from '@mantine/core';
import globalClasses from '../styles/global.module.css';
import { ReactNode } from 'react';

export const Notice = ({
  blink,
  content,
  width,
  onClick,
}: {
  width?: number;
  blink?: boolean;
  content: ReactNode;
  onClick?: () => void;
}) => {
  return (
    <HoverCard width={width} shadow="md">
      <HoverCard.Target>
        <Box
          onClick={onClick}
          style={{ cursor: onClick ? 'pointer' : 'default' }}
          className={`${globalClasses.notice} ${blink ? globalClasses.noticeBlink : ''}`}
        />
      </HoverCard.Target>
      <HoverCard.Dropdown
        w={width}
        classNames={{ dropdown: globalClasses.popoverDropdown }}
      >
        {content}
      </HoverCard.Dropdown>
    </HoverCard>
  );
};
