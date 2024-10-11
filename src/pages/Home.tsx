import {
  Avatar,
  Box,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { BigTitle, SectionText } from '../components/Typography';
import { VoteType } from '../components/Cards';
import {
  IconBuildingBroadcastTower,
  IconChartBar,
  IconTrophy,
} from '@tabler/icons-react';

export const Home = () => {
  return (
    // <CenterLayout>
    <Box style={{ containerType: 'inline-size' }} mb="xl" mt={48} mr={88}>
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
    // </CenterLayout>
  );
};

const VoteCard = ({ title }: { title: string }) => {
  const { colors } = useMantineTheme();
  return (
    <Paper p="md">
      <Text fw={500} c={colors.steel[0]} mb="sm">
        {title}
      </Text>
      <Group gap={'xs'} mb="sm">
        <Avatar src={''} size={28} bg={colors.steel[5]} />
        <Text c={colors.steel[4]}>jord.eth</Text>
      </Group>
      <Text fz="sm" c={colors.steel[4]}>
        Ends in 4d 8h 32s
      </Text>
    </Paper>
  );
};
