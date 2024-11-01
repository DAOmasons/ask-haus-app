import { useQuery } from '@tanstack/react-query';
import { getPastPolls } from '../queries/poll';
import { Display } from '../components/Display';
import { CenterLayout } from '../layout/Layout';
import { Box, Stack } from '@mantine/core';
import { SubTitle } from '../components/Typography';
import { VoteCard } from '../components/cards/VoteCard';
import { VoteType } from '../constants/enum';

export const Past = () => {
  const {
    data: polls,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['activePolls'],
    queryFn: getPastPolls,
  });

  if (isLoading) {
    return null;
  }

  if (error || !polls) {
    return (
      <Display
        title="Error"
        description={error?.message || 'Error: No polls found'}
      />
    );
  }

  return (
    <CenterLayout>
      <Box w="100%" maw={500} mb="lg">
        <SubTitle mb="lg">Past</SubTitle>
        <Stack>
          {polls?.length > 0 ? (
            polls.map((poll) => {
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
            <Display title="No Polls" description="There are no past polls" />
          )}
        </Stack>
      </Box>
    </CenterLayout>
  );
};
