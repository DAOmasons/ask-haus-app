import { Box, Group } from '@mantine/core';
import { CenterLayout } from '../layout/Layout';
import { BigTitle, SectionText } from '../components/Typography';
import { VoteType } from '../components/Cards';
import {
  IconBuildingBroadcastTower,
  IconChartBar,
  IconTrophy,
} from '@tabler/icons-react';

export const Home = () => {
  return (
    <CenterLayout>
      <Box style={{ containerType: 'inline-size' }} mb="xl">
        <BigTitle>ask.haus</BigTitle>
        <SectionText mb="md" mt="md">
          Vote Types
        </SectionText>
        <Group>
          <VoteType title="Poll" Icon={IconChartBar} />
          <VoteType title="Signal Session" Icon={IconBuildingBroadcastTower} />
          <VoteType title="Contest" Icon={IconTrophy} />
        </Group>
      </Box>
    </CenterLayout>
  );
};
