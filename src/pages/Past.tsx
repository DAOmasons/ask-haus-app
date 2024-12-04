import { useQuery } from '@tanstack/react-query';
import { Display } from '../components/Display';
import { CenterLayout } from '../layout/Layout';
import { Box, Stack } from '@mantine/core';
import { SubTitle } from '../components/Typography';
import { VoteCard } from '../components/cards/VoteCard';
import { getPastRounds } from '../queries/lists';

export const Past = () => {
  const {
    data: rounds,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['activePolls'],
    queryFn: getPastRounds,
  });

  if (isLoading) {
    return null;
  }

  if (error || !rounds) {
    return (
      <Display
        title="Error"
        description={error?.message || 'Error: No rounds found'}
      />
    );
  }

  return (
    <CenterLayout>
      <Box w="100%" maw={500} mb="lg">
        <SubTitle mb="lg">Past</SubTitle>
        <Stack>
          {rounds?.length > 0 ? (
            rounds.map((round) => {
              return <VoteCard key={round.id} {...round} />;
            })
          ) : (
            <Display
              title="No Past Rounds"
              description="There are no past rounds"
            />
          )}
        </Stack>
      </Box>
    </CenterLayout>
  );
};
