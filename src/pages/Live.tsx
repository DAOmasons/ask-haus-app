import { useQuery } from '@tanstack/react-query';
import { getActivePolls } from '../queries/poll';
import { Display } from '../components/Display';
import { CenterLayout } from '../layout/Layout';
import { Box, Stack } from '@mantine/core';
import { SubTitle } from '../components/Typography';
import { VoteCard } from '../components/cards/VoteCard';
import { VoteType } from '../constants/enum';

export const Live = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['activePolls'],
    queryFn: getActivePolls,
  });

  if (isLoading) {
    return null;
  }

  if (error) {
    return (
      <Display title="Error" description={error.message || 'Unknown error'} />
    );
  }

  const allPolls = [
    ...(data?.activePolls || []),
    ...(data?.upcomingPolls || []),
  ];
  return (
    <CenterLayout>
      <Box w="100%" maw={500} mb="lg">
        <SubTitle mb="lg">Live Polls</SubTitle>
        <Stack>
          {allPolls?.length > 0 ? (
            allPolls.map((poll) => {
              return (
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
              );
            })
          ) : (
            <Display title="No Polls" description="There are no live polls" />
          )}
        </Stack>
      </Box>
    </CenterLayout>
  );
};
