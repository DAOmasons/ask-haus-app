import { Box, Button, Flex, Group, Stack } from '@mantine/core';
import { BigTitle, SectionText } from '../components/Typography';
import { VoteTypeCard } from '../components/cards/VoteTypeCard';
import {
  IconChartBar,
  IconQuestionMark,
  IconTrophy,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { getFrontPageVotes } from '../queries/frontPage';
import { useQuery } from '@tanstack/react-query';
import { VoteCard } from '../components/cards/VoteCard';

export const Home = () => {
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: [`home`],
    queryFn: getFrontPageVotes,
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
          title="Contest"
          Icon={IconTrophy}
          onClick={() => navigate('/create-contest')}
          // underConstruction
        />
        <VoteTypeCard
          title="New Vote Type"
          Icon={IconQuestionMark}
          underConstruction
        />
      </Group>
      <Flex align="start" justify="space-between" gap="md">
        {data?.active && data?.active.length > 0 && (
          <Box w="50%">
            <SectionText mb="md">Live Rounds</SectionText>
            <Stack gap="md" mb="xl">
              {data.active.map((vote) => (
                <VoteCard key={vote.id} {...vote} />
              ))}
            </Stack>
            {data?.active && data.active.length === 5 && (
              <Group justify="center">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => navigate('/active')}
                >
                  See More
                </Button>
              </Group>
            )}
          </Box>
        )}
        <Box w="50%">
          <SectionText mb="md">Past Rounds</SectionText>
          <Stack gap="md" mb="xl">
            {data?.past &&
              data.past.length > 0 &&
              data.past.map((vote) => <VoteCard key={vote.id} {...vote} />)}
          </Stack>
          {data?.past && data.past.length === 5 && (
            <Group justify="center">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => navigate('/past')}
              >
                See More
              </Button>
            </Group>
          )}
        </Box>
      </Flex>
    </Box>
  );
};
