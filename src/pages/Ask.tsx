import {
  Box,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { CenterLayout } from '../layout/Layout';
import { Bold, SubTitle } from '../components/Typography';
import {
  IconBuildingBroadcastTower,
  IconChartBar,
  IconTrophy,
} from '@tabler/icons-react';
import paperClasses from '../styles/paper.module.css';
import { useNavigate } from 'react-router-dom';

export const Ask = () => {
  const { colors } = useMantineTheme();
  const navigate = useNavigate();
  return (
    <CenterLayout>
      <Box w="100%" maw={500} mb="lg">
        <SubTitle mb="sm">Ask</SubTitle>
        <Text c={colors.steel[2]} fz="sm" mb="xl">
          Choose a vote format and ask your question
        </Text>
        <Stack gap="xl">
          <Paper
            classNames={{ root: paperClasses.clickable }}
            onClick={() => navigate('/create-poll')}
          >
            <Group>
              <Flex
                align="center"
                direction="column"
                justify="center"
                h={125}
                w={125}
              >
                <IconChartBar size={48} color={colors.steel[2]} />
                <Text c={colors.steel[2]} mt="xs" fz="sm">
                  Poll
                </Text>
              </Flex>
              <Text c={colors.steel[2]} fz="sm" style={{ flex: 1 }}>
                Polls use a <Bold>set list of options</Bold> to ask the DAO a
                specific question. Polls are a <Bold>fast</Bold> way to figure
                out what the hell people actually want. Good for meetings,
                temp-checks, etc.
              </Text>
            </Group>
          </Paper>

          <Paper
            classNames={{ root: paperClasses.clickable }}
            onClick={() => navigate('/create-contest')}
          >
            <Group>
              <Text c={colors.steel[2]} fz="sm" style={{ flex: 1 }}>
                The DAO <Bold>members submit their own options</Bold>. Then the
                DAO votes to decide on the best option. Contests use collective
                decision making to arrive at the best decision.
              </Text>
              <Flex
                align="center"
                direction="column"
                justify="center"
                h={125}
                w={125}
              >
                <IconTrophy size={48} color={colors.steel[2]} />
                <Text c={colors.steel[2]} mt="xs" fz="sm">
                  Contest
                </Text>
              </Flex>
            </Group>
          </Paper>

          <Tooltip label="Under Construction">
            <Paper>
              <Group>
                <Flex
                  align="center"
                  direction="column"
                  justify="center"
                  h={125}
                  w={125}
                >
                  <IconBuildingBroadcastTower
                    size={48}
                    color={colors.steel[4]}
                  />
                  <Text c={colors.steel[4]} mt="xs" fz="sm">
                    Signal Sessions
                  </Text>
                </Flex>
                <Text c={colors.steel[4]} fz="sm" style={{ flex: 1 }}>
                  Signal Sessions is a vote style similar to a contest, except
                  that{' '}
                  <Bold>
                    options are created during the voting round and votes are
                    retractable.
                  </Bold>{' '}
                  This style is good for setting strategic priorities for an
                  upcoming term.
                </Text>
              </Group>
            </Paper>
          </Tooltip>
        </Stack>
      </Box>
    </CenterLayout>
  );
};
