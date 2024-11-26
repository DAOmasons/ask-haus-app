import { Box, Flex, Group, Stack } from '@mantine/core';
import { BigTitle, SectionText } from '../components/Typography';
import { VoteTypeCard } from '../components/cards/VoteTypeCard';
import {
  IconBuildingBroadcastTower,
  IconChartBar,
  IconTrophy,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { getFrontPageVotes } from '../queries/frontPage';
import { useQuery } from '@tanstack/react-query';
import { VoteType } from '../constants/enum';
import { VoteCard } from '../components/cards/VoteCard';

export const Home = () => {
  const navigate = useNavigate();
  const { data: pollData } = useQuery({
    queryKey: [`home`],
    queryFn: getFrontPageVotes,
    enabled: true,
  });

  const notablePolls = [
    ...(pollData?.activePolls || []),
    ...(pollData?.upcomingPolls || []),
  ];

  const notableContests = [...pollData?.votingContests || [], ...pollData?.];

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
          title="Contest"
          Icon={IconTrophy}
          onClick={() => navigate('/create-contest')}
          // underConstruction
        />
        <VoteTypeCard
          title="Signal Session"
          Icon={IconBuildingBroadcastTower}
          underConstruction
        />
      </Group>
      <Flex align="start" justify="space-between" gap="md">
        {notablePolls.length > 0 && (
          <Box w="50%">
            <SectionText mb="md">Live Votes</SectionText>
            <Stack gap="md">
              {notablePolls.map((poll) => (
                <VoteCard
                  key={poll.id}
                  to={`/poll/${poll.id}`}
                  title={poll.title}
                  postedBy={poll.postedBy}
                  startTime={poll.votesParams?.startTime}
                  endTime={poll.votesParams?.endTime}
                  duration={poll.votesParams?.duration}
                  description={poll.description as string | undefined}
                  pollLink={poll.pollLink as string | undefined}
                  voteType={VoteType.Poll}
                />
              ))}
            </Stack>
          </Box>
        )}
        <Box w="50%">
          <SectionText mb="md">Past Votes</SectionText>
          <Stack gap="md">
            {pollData?.pastPolls?.map((poll) => (
              <VoteCard
                key={poll.id}
                to={`/poll/${poll.id}`}
                title={poll.title}
                postedBy={poll.postedBy}
                startTime={poll.votesParams?.endTime}
                endTime={poll.votesParams?.endTime}
                duration={poll.votesParams?.duration}
                description={poll.description as string | undefined}
                pollLink={poll.pollLink as string | undefined}
                voteType={VoteType.Poll}
              />
            ))}
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
};
