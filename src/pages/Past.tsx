import { useQuery } from '@tanstack/react-query';
import { Display } from '../components/Display';
import { CenterLayout } from '../layout/Layout';
import layoutClasses from '../styles/Layout.module.css';
import { Box, Stack } from '@mantine/core';
import { SubTitle, BigTitle } from '../components/Typography';
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
      <Box mb="lg" pl="25px" pr="25px">
        <BigTitle className={layoutClasses.noDesktop} mb="lg">
          ask.haus
        </BigTitle>{' '}
        <SubTitle mb="lg">Past</SubTitle>
        <Stack>
          {rounds?.length > 0 ? (
            rounds.map((round) => {
              return <VoteCard key={round.id} {...round} />;
            })
          ) : (
            <Display
              title="No Past Votes"
              description="There are no past votes"
            />
          )}
        </Stack>
      </Box>
    </CenterLayout>
  );
};
