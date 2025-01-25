import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Display } from '../components/Display';
import { CenterLayout } from '../layout/Layout';
import layoutClasses from '../styles/Layout.module.css';
import {
  Box,
  Chip,
  Flex,
  Stack,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { SubTitle, BigTitle } from '../components/Typography';
import { IconChartBar, IconTrophy } from '@tabler/icons-react';
import { VoteCard } from '../components/cards/VoteCard';
import { getPastRounds } from '../queries/lists';
import { FeedSkeletonCard } from '../layout/Skeletons';

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
      <Box w="80%" maw={500} mb="lg" pl="25px" pr="25px">
        <BigTitle className={layoutClasses.noDesktop} mb="lg">
          ask.haus
        </BigTitle>{' '}
        <Flex justify="space-between" align="center" w="100%">
          <SubTitle mb="lg">Past</SubTitle>
          <Flex gap="sm">
            <Tooltip label="toggle show polls">
              <Chip
                variant="outline"
                checked={showPolls}
                onChange={() => setShowPolls((prev) => !prev)}
              >
                <IconChartBar size={14} color={colors.steel[4]} />
              </Chip>
            </Tooltip>
            <Tooltip label="toggle show contest">
              <Chip
                variant="outline"
                checked={showContests}
                onChange={() => setShowContests((prev) => !prev)}
              >
                <IconTrophy size={14} color={colors.steel[4]} />
              </Chip>
            </Tooltip>
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
