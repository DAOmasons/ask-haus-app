import { Box, Flex } from '@mantine/core';

export const DesktopFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex>
      <Box>{children}</Box>
    </Flex>
  );
};
