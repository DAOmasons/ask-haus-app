import { useQuery } from '@tanstack/react-query';

import { Display } from '../components/Display';
import { CenterLayout } from '../layout/Layout';
import layoutClasses from '../styles/Layout.module.css';
import { Box, Stack } from '@mantine/core';
import { SubTitle, BigTitle } from '../components/Typography';
import { VoteCard } from '../components/cards/VoteCard';
import { getActiveRounds } from '../queries/lists';
import { FeedSkeletonCard } from '../layout/Skeletons';

export const Live = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['activePolls'],
    queryFn: getActiveRounds,
  });

  const LiveWrapper: React.FC<{ children?: React.ReactNode }> = ({
    children,
  }) => (
    <CenterLayout>
      <Box w="80%" maw={500} mb="lg" pl="25px" pr="25px">
        <BigTitle className={layoutClasses.noDesktop} mb="lg">
          ask.haus
        </BigTitle>
        <SubTitle mb="lg">Live</SubTitle>
        {children}
      </Box>
    </CenterLayout>
  );

  if (isLoading) {
    return (
      <LiveWrapper>
        <FeedSkeletonCard />
        <FeedSkeletonCard />
        <FeedSkeletonCard />
        <FeedSkeletonCard />
        <FeedSkeletonCard />
      </LiveWrapper>
    );
  }

  if (error || !data) {
    return (
      <Display title="Error" description={error?.message || 'Unknown error'} />
    );
  }

  return (
    <LiveWrapper>
      <Stack>
        {data && data?.length > 0 ? (
          data.map((round) => {
            return <VoteCard key={round.id} {...round} />;
          })
        ) : (
          <Display title="No Polls" description="There are no live polls" />
        )}
      </Stack>
    </LiveWrapper>
  );
};
