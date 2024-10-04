import { Box } from '@mantine/core';
import { LinesBg } from './LinesBg';
import { DesktopFrame } from './DesktopFrame';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
      }}
    >
      <DesktopFrame>{children}</DesktopFrame>
      <LinesBg />
    </Box>
  );
};
