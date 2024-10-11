import { Box, Flex, Group, Stack } from '@mantine/core';
import { BigTitle, SectionText } from '../components/Typography';
import { VoteCard, VoteType } from '../components/Cards';
import {
  IconBuildingBroadcastTower,
  IconChartBar,
  IconTrophy,
} from '@tabler/icons-react';
import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit';

export const Home = () => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();

  return (
    <Box mb="xl" mt={48}>
      <BigTitle>ask.haus</BigTitle>
      <SectionText mb="md" mt={65}>
        Vote Types
      </SectionText>
      <Group mb="xl">
        <VoteType title="Poll" Icon={IconChartBar} />
        <VoteType title="Signal Session" Icon={IconBuildingBroadcastTower} />
        <VoteType title="Contest" Icon={IconTrophy} />
      </Group>
      <Flex align="start" justify="space-between" gap="md">
        <Box w="50%">
          <SectionText mb="md">Live Votes</SectionText>
          <Stack gap="md">
            <VoteCard title="Let's take a poll" />
            <VoteCard title="Let's take a poll" />
            <VoteCard title="Let's take a poll" />
            <VoteCard title="Let's take a poll" />
          </Stack>
        </Box>
        <Box w="50%">
          <SectionText mb="md">Past Votes</SectionText>
          <Stack gap="md">
            <VoteCard title="Let's take a poll" />
            <VoteCard title="Let's take a poll" />
            <VoteCard title="Let's take a poll" />
            <VoteCard title="Let's take a poll" />
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
};
