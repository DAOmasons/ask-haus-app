import {
  Box,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { HolderType, VoteStage } from '../../constants/enum';
import { secondsToDate } from '../../utils/time';
import { formatEther } from 'viem';

export const DetailsModal = ({
  opened,
  close,
  choiceStartTime,
  choiceEndTime,
  voteStartTime,
  voteEndTime,
  voteStage,
  snapshot,
  answerType,
  holderThreshold,
  voteToken,
  choiceToken,
}: {
  opened: boolean;
  close: () => void;
  choiceStartTime?: number;
  choiceEndTime?: number;
  voteStartTime?: number;
  voteEndTime?: number;
  snapshot?: number;
  answerType?: string;
  holderThreshold?: bigint;
  voteToken?: number;
  voteStage?: VoteStage;
  choiceToken?: number;
}) => {
  const { colors } = useMantineTheme();
  return (
    <Modal.Root opened={opened} onClose={close} centered lockScroll={false}>
      <Modal.Overlay />
      <Modal.Content miw={300} maw={440} style={{ overflowY: 'auto' }}>
        <Group w="100%" justify="space-between">
          <Modal.Title>Contest Details</Modal.Title>
          <Modal.CloseButton onClick={close} />
        </Group>
        <ScrollArea h={425}>
          <Stack gap="sm">
            {voteStage && (
              <Box my="sm">
                <Text fz="xs" mb="4" c={colors.steel[2]}>
                  Current Stage
                </Text>
                <Text fz="sm" c={colors.steel[0]}>
                  {voteStage}
                </Text>
              </Box>
            )}
            <Text fz="sm" fw={700} c={colors.steel[0]}>
              Timing
            </Text>
            <Stack gap={'sm'} mb="md">
              {choiceStartTime && (
                <Box>
                  <Text fz="xs" mb="4" c={colors.steel[2]}>
                    Choice Round Starts
                  </Text>
                  <Text fz="sm" c={colors.steel[0]}>
                    {secondsToDate(choiceStartTime)}
                  </Text>
                </Box>
              )}
              {choiceEndTime && (
                <Box>
                  <Text fz="xs" mb="4" c={colors.steel[2]}>
                    Choice Round Ends
                  </Text>
                  <Text fz="sm" c={colors.steel[0]}>
                    {secondsToDate(choiceEndTime)}
                  </Text>
                </Box>
              )}
              {voteStartTime && (
                <Box>
                  <Text fz="xs" mb="4" c={colors.steel[2]}>
                    Voting Round Starts
                  </Text>
                  <Text fz="sm" c={colors.steel[0]}>
                    {secondsToDate(voteStartTime)}
                  </Text>
                </Box>
              )}
              {voteEndTime && (
                <Box>
                  <Text fz="xs" mb="4" c={colors.steel[2]}>
                    Voting Round Ends
                  </Text>
                  <Text fz="sm" c={colors.steel[0]}>
                    {secondsToDate(voteEndTime)}
                  </Text>
                </Box>
              )}
              {snapshot && (
                <Box>
                  <Text fz="xs" mb="4" c={colors.steel[2]}>
                    Contest Snapshot
                  </Text>
                  <Text fz="sm" c={colors.steel[0]}>
                    {snapshot}
                  </Text>
                </Box>
              )}
            </Stack>
            <Text fz="sm" fw={700} c={colors.steel[0]}>
              Parameters
            </Text>
            <Stack gap={'sm'}>
              {answerType && (
                <Box>
                  <Text fz="xs" mb="4" c={colors.steel[2]}>
                    Answer Type
                  </Text>
                  <Text fz="sm" c={colors.steel[0]}>
                    {answerType}
                  </Text>
                </Box>
              )}
              {holderThreshold !== undefined && (
                <Box>
                  <Text fz="xs" mb="4" c={colors.steel[2]}>
                    Submit Choice Threshold
                  </Text>
                  <Text fz="sm" c={colors.steel[0]}>
                    {formatEther(holderThreshold)} {}
                  </Text>
                </Box>
              )}
              {voteToken && (
                <Box>
                  <Text fz="xs" mb="4" c={colors.steel[2]}>
                    Vote Token
                  </Text>
                  <Text fz="sm" c={colors.steel[0]}>
                    {voteToken === HolderType.Share
                      ? 'Share'
                      : voteToken === HolderType.Loot
                        ? 'Loot'
                        : voteToken === HolderType.Both
                          ? 'Both'
                          : '?'}
                  </Text>
                </Box>
              )}
              {choiceToken && (
                <Box>
                  <Text fz="xs" mb="4" c={colors.steel[2]}>
                    Choice Token
                  </Text>
                  <Text fz="sm" c={colors.steel[0]}>
                    {choiceToken === HolderType.Share
                      ? 'Share'
                      : choiceToken === HolderType.Loot
                        ? 'Loot'
                        : choiceToken === HolderType.Both
                          ? 'Both'
                          : '?'}
                  </Text>
                </Box>
              )}
            </Stack>
          </Stack>
        </ScrollArea>
      </Modal.Content>
    </Modal.Root>
  );
};
