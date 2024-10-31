import { useMemo } from 'react';
import { BasicChoiceFragment } from '../../generated/graphql';
import {
  Box,
  Button,
  ColorSwatch,
  Group,
  Paper,
  Radio,
  Slider,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { IconExternalLink, IconSearch } from '@tabler/icons-react';
import { ChoiceInputType } from '../../constants/enum';
import { Display } from '../Display';
import { TxButton } from '../TxButton';

export const VotePanel = ({
  title,
  open,
  pollLink,
  answerType,
  choices,
  entries,
  handleSliderChange,
  isActive,
  selectedChoice,
  setSelectedChoice,
  totalAllocated,
  isUpcoming,
  handleVote,
  isLoading,
  pointsDisplay,
}: {
  title: string;
  open: () => void;
  pollLink?: string;
  pointsDisplay?: string;
  answerType?: string;
  choices?: BasicChoiceFragment[];
  entries: Record<string, number>;
  handleSliderChange: (id: string, perc: number) => void;
  isActive: boolean;
  selectedChoice?: string;
  setSelectedChoice: (choice: string) => void;
  totalAllocated: number;
  isUpcoming: boolean;
  handleVote: () => void;
  isLoading: boolean;
}) => {
  const theme = useMantineTheme();

  const tokenDisplay = useMemo(() => {
    if (pointsDisplay == null) {
      return <Text c={theme.colors.steel[2]} fz="xs" mt="sm"></Text>;
    }
    if (pointsDisplay === '0') {
      return (
        <Text c={theme.colors.steel[2]} fz="xs" mt="sm">
          Your account does not have points to vote with
        </Text>
      );
    }

    return (
      <Text c={theme.colors.steel[2]} fz="xs" mt="sm">
        Your account has {pointsDisplay} points to vote with
      </Text>
    );
  }, [pointsDisplay, theme.colors]);

  return (
    <>
      <Stack w="100%" maw={500} gap={'xl'} mb="xl">
        <Paper>
          <Group mb="sm" gap="0">
            <Text fw={600} c={theme.colors.steel[0]} mr={'sm'}>
              Question
            </Text>
          </Group>
          <Text c={theme.colors.steel[4]} mb={'md'}>
            {title}
          </Text>
          <Group gap="sm">
            <Button
              size="xs"
              variant="secondary"
              leftSection={<IconSearch size={14} />}
              onClick={open}
            >
              Details
            </Button>
            {pollLink && (
              <Button
                size="xs"
                variant="secondary"
                leftSection={<IconExternalLink size={14} />}
                component="a"
                href={pollLink}
                rel="noreferrer"
                target="_blank"
              >
                Poll Link
              </Button>
            )}
          </Group>
        </Paper>
        <Paper>
          <Text fw={600} c={theme.colors.steel[0]} mb="2px">
            Answer
          </Text>
          {answerType === ChoiceInputType.Allocate && (
            <Text c={theme.colors.steel[4]} fz="xs" mb="md">
              Adjust the sliders to distribute your vote
            </Text>
          )}
          {answerType === ChoiceInputType.Single && (
            <Text c={theme.colors.steel[4]} fz="xs" mb="md">
              100% of your voting power will be allocated to that choice
            </Text>
          )}
          {answerType === ChoiceInputType.Allocate && (
            <Stack gap={'xl'}>
              {choices?.map((c) => {
                const currentValue = entries[c.choiceId] || 0;
                return (
                  <Box key={c.choiceId}>
                    <Group mb="xs" align="start" gap={'xs'}>
                      <ColorSwatch
                        color={c.color as string}
                        size={16}
                        style={{ transform: 'translateY(2.5px)' }}
                      />
                      <Text fw={500}>{c.title}</Text>
                    </Group>
                    <Group gap={0}>
                      <Text w={'10%'} fz="sm">
                        {currentValue || 0}%
                      </Text>
                      <Box w="90%">
                        <Slider
                          label={`${c.title} (${currentValue}%)`}
                          max={100}
                          min={0}
                          disabled={!isActive}
                          color={c.color as string}
                          value={currentValue}
                          onChange={(value) =>
                            handleSliderChange(c.choiceId, value)
                          }
                        />
                      </Box>
                    </Group>
                  </Box>
                );
              })}
              {tokenDisplay}
            </Stack>
          )}
          {answerType === ChoiceInputType.Single && (
            <Stack gap={'md'}>
              {choices?.map((c) => (
                <Radio
                  key={c.choiceId}
                  label={c.title}
                  disabled={!isActive}
                  color={c.color as string}
                  checked={selectedChoice === c.choiceId}
                  onChange={() => setSelectedChoice(c.choiceId)}
                />
              ))}
              {tokenDisplay}
            </Stack>
          )}
        </Paper>
        <Paper>
          <Box>
            <Text fw={400} c={theme.colors.steel[2]} mb="xs" fz="sm">
              Total allocated: {totalAllocated}%
            </Text>
            <Text c={theme.colors.steel[2]} fz="sm">
              Remaining: {100 - totalAllocated}%
            </Text>
          </Box>
        </Paper>
        {isUpcoming && (
          <Display
            title="Voting not started"
            description="This poll was scheduled in advance. Please check back later."
          />
        )}
        {!isUpcoming && !isActive && (
          <Display
            title="Voting has ended"
            description="Please check the results"
          />
        )}
      </Stack>
      {isActive && (
        <TxButton
          disabled={isLoading || totalAllocated !== 100}
          onClick={handleVote}
        />
      )}
    </>
  );
};
