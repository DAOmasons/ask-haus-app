import { Box, Group } from '@mantine/core';
import { CenterLayout } from '../layout/Layout';
import { SubTitle } from '../components/Typography';

export const Contest = () => {
  return (
    <CenterLayout>
      <Box w="100%" maw={500} mb="lg">
        <Group mb="sm" align="center" justify="space-between">
          <Group>
            <SubTitle>Contest</SubTitle>
          </Group>
        </Group>
      </Box>
    </CenterLayout>
  );
};
