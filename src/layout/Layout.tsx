import { Box } from '@mantine/core';
import { DesktopFrame } from './DesktopFrame';
import layoutClasses from '../styles/Layout.module.css';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return <DesktopFrame>{children}</DesktopFrame>;
};

export const CenterLayout = ({ children }: { children: React.ReactNode }) => (
  <Box className={layoutClasses.centerLayout}>{children}</Box>
);
