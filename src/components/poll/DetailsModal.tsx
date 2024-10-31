import {
  ActionIcon,
  Box,
  Group,
  Modal,
  SegmentedControl,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { BasicChoiceFragment } from '../../generated/graphql';
import { useState } from 'react';
import { secondsToDate } from '../../utils/time';
import { IconExternalLink } from '@tabler/icons-react';

export const DetailsModal = ({
  opened,
  close,
  endTime,
  startTime,
  description = 'No description provided',
  pollLink,
  snapshot,
  choices,
}: {
  startTime?: number;
  endTime?: number;
  snapshot: string;
  pollLink?: string;
  description?: string;
  question?: string;
  opened: boolean;
  close: () => void;
  choices: BasicChoiceFragment[] | undefined;
}) => {
  const theme = useMantineTheme();
  const [segment, setSegment] = useState('Poll');

  return (
    <Modal.Root opened={opened} onClose={close} centered lockScroll={false}>
      <Modal.Overlay />
      <Modal.Content miw={300} maw={440} h={425} style={{ overflowY: 'auto' }}>
        <Group w="100%" mb="md">
          <SegmentedControl
            data={['Poll', 'Answers']}
            size="xs"
            value={segment}
            onChange={setSegment}
          />
          <Modal.CloseButton />
        </Group>

        {segment === 'Poll' && (
          <Stack>
            {description && (
              <Box>
                <Text fz={'xs'} mb="4" c={theme.colors.steel[4]}>
                  Poll Description
                </Text>
                <Text fz="sm" c={theme.colors.steel[2]}>
                  {description}
                </Text>
              </Box>
            )}
            {pollLink && (
              <Box>
                <Text fz={'xs'} mb="4" c={theme.colors.steel[4]}>
                  Poll Link
                </Text>
                <Text
                  component="a"
                  fz="sm"
                  href="/create-poll"
                  rel="noopener"
                  target="_blank"
                  c={theme.colors.steel[2]}
                >
                  {pollLink}
                </Text>
              </Box>
            )}
            <Box>
              <Text fz={'xs'} mb="4" c={theme.colors.steel[4]}>
                Snapshot Timestamp
              </Text>
              <Text fz="sm" c={theme.colors.steel[2]}>
                {secondsToDate(Number(snapshot))}
              </Text>
            </Box>
            <Box>
              <Text fz={'xs'} mb="4" c={theme.colors.steel[4]}>
                Start Time
              </Text>
              <Text fz="sm" c={theme.colors.steel[2]}>
                {secondsToDate(Number(startTime))}
              </Text>
            </Box>
            <Box>
              <Text fz={'xs'} mb="4" c={theme.colors.steel[4]}>
                End Time
              </Text>
              <Text fz="sm" c={theme.colors.steel[2]}>
                {secondsToDate(Number(endTime))}
              </Text>
            </Box>
          </Stack>
        )}
        {segment === 'Answers' && (
          <Stack>
            <Text fz={'xs'} c={theme.colors.steel[4]} mb="xs">
              Poll Answers
            </Text>
            {choices?.map((c, i) => (
              <Box key={c.id}>
                <Group gap={4}>
                  <Text fz="sm" c={theme.colors.steel[2]}>
                    {i + 1}) {c.title}
                  </Text>
                  {c.link && (
                    <ActionIcon
                      variant="ghost-icon"
                      component="a"
                      href={c.link}
                      rel="noopener"
                      target="_blank"
                    >
                      <IconExternalLink
                        size={14}
                        color={theme.colors.steel[4]}
                      />
                    </ActionIcon>
                  )}
                </Group>
                {c.description && (
                  <Text fz="xs" c={theme.colors.steel[4]}>
                    {c.description}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </Modal.Content>
    </Modal.Root>
  );
};
