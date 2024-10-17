import { Box, Group, Text } from '@mantine/core';
import { DesktopFrame } from './DesktopFrame';
import layoutClasses from '../styles/Layout.module.css';
import { IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return <DesktopFrame>{children}</DesktopFrame>;
};

export const CenterLayout = ({ children }: { children: React.ReactNode }) => (
  <Box className={layoutClasses.centerLayout}>{children}</Box>
);

export const CenterPageTitle = ({
  title,
  onClick,
}: {
  title: string;
  onClick?: () => void;
}) => {
  const navigate = useNavigate();
  return (
    <Group mb="xl" w="100%" maw="500px">
      <IconArrowLeft
        size={28}
        onClick={onClick ? onClick : () => navigate(-1)}
        style={{ cursor: 'pointer' }}
      />
      <Text fz="xl" fw={700} ml="30%">
        {title}
      </Text>
    </Group>
  );
};
