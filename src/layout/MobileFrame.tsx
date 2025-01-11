import { Box, Flex } from '@mantine/core';
import layoutClasses from '../styles/Layout.module.css';
import { MobileNav } from './MobileNav';

export const MobileFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex>
      <Box className={layoutClasses.appFrame}>
        {children}
        <MobileNav />
      </Box>
    </Flex>
  );
};
