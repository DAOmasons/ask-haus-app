import { Box, Group, Text } from '@mantine/core';
import { DesktopFrame } from './DesktopFrame';
import layoutClasses from '../styles/Layout.module.css';
import { IconArrowLeft } from '@tabler/icons-react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return <DesktopFrame>{children}</DesktopFrame>;
};

export const CenterLayout = ({ children }: { children: React.ReactNode }) => (
  <Box className={layoutClasses.centerLayout}>{children}</Box>
);

export const CenterPageTitle = ({ title }: { title: string }) => (
  <Group mb="xl" w="100%" maw="500px">
    <IconArrowLeft size={28} />
    <Text fz="xl" fw={700} ml="30%">
      {title}
    </Text>
  </Group>
);
