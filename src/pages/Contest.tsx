import {
  Box,
  Divider,
  Group,
  Paper,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { CenterLayout } from '../layout/Layout';
import { SubTitle } from '../components/Typography';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getContest } from '../queries/contest';
import { RichTextEditor } from '@mantine/tiptap';
import { TipTapDisplay } from '../components/TipTapDisplay';

export const Contest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { colors } = useMantineTheme();
  const [view, setView] = useState<string | undefined>();
  const [tick, setTick] = useState(new Date());

  const { data } = useQuery({
    queryKey: ['contest', id],
    queryFn: () => getContest({ contestId: id as string }),
    enabled: !!id,
  });

  console.log('data', data);

  return (
    <CenterLayout>
      <Box w="100%" maw={500} mb="lg">
        <Group mb="md" align="center" justify="space-between">
          <SubTitle>Contest</SubTitle>
        </Group>
        <Paper>
          <Box mb="md">
            <Text fz="28" mb="xs" fw={700} c={colors.steel[0]}>
              {data?.title}
            </Text>
            {data?.description && <Divider />}
          </Box>
          {data?.description && <TipTapDisplay content={data?.description} />}
        </Paper>
      </Box>
    </CenterLayout>
  );
};
