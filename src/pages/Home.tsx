import { Box, Flex, Group, Stack } from '@mantine/core';
import { BigTitle, SectionText } from '../components/Typography';
import { VoteTypeCard } from '../components/cards/VoteTypeCard';
import {
  IconBuildingBroadcastTower,
  IconChartBar,
  IconTrophy,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { frontPagePolls } from '../queries/frontPage';
import { useQuery } from '@tanstack/react-query';
import { VoteType } from '../constants/enum';
import { VoteCard } from '../components/cards/VoteCard';

export const Home = () => {
  const navigate = useNavigate();
  const {
    data: pollData,
    isLoading: isLoadingPolls,
    error: errorPolls,
  } = useQuery({
    queryKey: [`home`],
    queryFn: frontPagePolls,
    enabled: true,
  });

  return (
    <Box mb="xl" mt={48}>
      <BigTitle>ask.haus</BigTitle>
      <SectionText mb="md" mt={65}>
        Vote Types
      </SectionText>
      <Group mb="xl">
        <VoteTypeCard
          title="Poll"
          Icon={IconChartBar}
          onClick={() => navigate('/create-poll')}
        />
        <VoteTypeCard
          title="Signal Session"
          Icon={IconBuildingBroadcastTower}
        />
        <VoteTypeCard title="Contest" Icon={IconTrophy} />
      </Group>
      <Flex align="start" justify="space-between" gap="md">
        <Box w="50%">
          <SectionText mb="md">Live Votes</SectionText>
          <Stack gap="md">
            {/* <VoteCard title="Let's take a poll" />
            <VoteCard title="Let's take a poll" />
            <VoteCard title="Let's take a poll" />
            <VoteCard title="Let's take a poll" /> */}
          </Stack>
        </Box>
        <Box w="50%">
          <SectionText mb="md">Past Votes</SectionText>
          <Stack gap="md">
            {pollData?.pastPolls?.map((poll) => (
              <VoteCard
                key={poll.id}
                title={poll.title}
                postedBy={poll.postedBy}
                startTime={poll.votesParams?.endTime}
                endTime={poll.votesParams?.endTime}
                duration={poll.votesParams?.duration}
                voteType={VoteType.Poll}
              />
            ))}
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
};
