import { Box, Flex, Image } from '@mantine/core';
import { LinesBg } from './LinesBg';

import layoutClasses from '../styles/Layout.module.css';
import { DesktopNav } from './DesktopNav';

export const DesktopFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex className={layoutClasses.desktopContainer}>
      <Box className={layoutClasses.desktopFrame}>
        <DesktopNav />
        <LinesBg />
        {children}
      </Box>
      <Image
        className={layoutClasses.desktopImg}
        src={'https://i.ibb.co/vwyFhSM/demo-Imgage.png'}
      />
    </Flex>
  );
};
