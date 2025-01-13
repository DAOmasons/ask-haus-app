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
import { useMobile, useTablet } from '../hooks/useBreakpoint';
import { CenterLayout } from '../layout/Layout';

export const Home = () => {
  const navigate = useNavigate();
  const isTablet = useTablet();
  const isMobile = useMobile() || isTablet;
  const { data } = useQuery({
    queryKey: [`home`],
    queryFn: getFrontPageVotes,
    enabled: true,
  });

  const content = (
    <Box mb="xl">
      <BigTitle mb="lg">ask.haus</BigTitle>
      <SectionText mb="md">Vote Types</SectionText>
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
        <VoteTypeCard title="TBA" Icon={IconQuestionMark} underConstruction />
      </Group>
      <Flex
        align="start"
        justify="space-between"
        gap="md"
        direction={isMobile ? 'column' : 'row'}
      >
        {data?.active && data?.active.length > 0 && (
          <Box w={isMobile ? '100%' : '50%'}>
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
        <Box w={isMobile ? '100%' : '50%'}>
          <SectionText mb="md">Past Votes</SectionText>
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

  return isMobile ? <CenterLayout>{content}</CenterLayout> : content;
};
