import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Display } from '../components/Display';
import { CenterLayout } from '../layout/Layout';
import layoutClasses from '../styles/Layout.module.css';
import { Box, Chip, Flex, Stack, useMantineTheme } from '@mantine/core';
import { SubTitle, BigTitle } from '../components/Typography';
import { IconChartBar, IconTrophy } from '@tabler/icons-react';
import { VoteCard } from '../components/cards/VoteCard';
import { FeedSkeletonCard } from '../layout/Skeletons';
import { getPastRounds } from '../queries/lists';

export const Past = () => {
  const [showPolls, setShowPolls] = useState(true);
  const [showContests, setShowContests] = useState(true);

  const {
    data: rounds,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['activePolls', showPolls, showContests],
    queryFn: () => getPastRounds({ showPolls, showContests }),
  });

  const { colors } = useMantineTheme();

  const PastWrapper: React.FC<{ children?: React.ReactNode }> = ({
    children,
  }) => (
    <CenterLayout>
      <Box w="100%" maw={500} mb="lg" pl="25px" pr="25px">
        <BigTitle className={layoutClasses.noDesktop} mb="lg">
          ask.haus
        </BigTitle>{' '}
        <Flex justify="space-between" align="flex-end" w="100%" mb="md">
          <SubTitle>Past</SubTitle>
          <Flex gap="sm">
            <Chip
              variant="outline"
              checked={showPolls}
              color={colors.steel[3]}
              onChange={() => setShowPolls((prev) => !prev)}
            >
              <IconChartBar size={14} color={colors.steel[4]} />
            </Chip>
            <Chip
              variant="outline"
              checked={showContests}
              color={colors.steel[3]}
              onChange={() => setShowContests((prev) => !prev)}
            >
              <IconTrophy size={14} color={colors.steel[4]} />
            </Chip>
          </Flex>
        </Flex>
        {children}
      </Box>
    </CenterLayout>
  );

  if (isLoading) {
    return (
      <PastWrapper>
        <FeedSkeletonCard />
        <FeedSkeletonCard />
        <FeedSkeletonCard />
        <FeedSkeletonCard />
        <FeedSkeletonCard />
      </PastWrapper>
    );
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
    <PastWrapper>
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
    </PastWrapper>
  );
};
