import { Box } from '@mantine/core';
import { DesktopFrame } from './DesktopFrame';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box>
      <DesktopFrame>{children}</DesktopFrame>
    </Box>
  );
};
