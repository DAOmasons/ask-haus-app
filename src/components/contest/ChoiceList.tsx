import {
  ActionIcon,
  Box,
  ColorSwatch,
  Divider,
  Group,
  Paper,
  Spoiler,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { SectionText } from '../Typography';
import { BasicChoiceFragment } from '../../generated/graphql';
import { IconChevronDown, IconChevronUp, IconLink } from '@tabler/icons-react';
import { TipTapDisplay } from '../TipTapDisplay';
import { AddressAvatar } from '../AddressAvatar';
import { Address } from 'viem';
import { secondsToDate } from '../../utils/time';

export const ChoiceList = ({
  choices,
}: {
  choices?: BasicChoiceFragment[];
}) => {
  const { colors } = useMantineTheme();
  return (
    <Box>
      <SectionText>Choices</SectionText>
      {choices && choices?.length > 0 ? (
        choices.map((choice, index) => (
          <Box mb="lg">
            <Group justify="space-between">
              <Group gap={6}>
                {choice.color && <ColorSwatch color={choice.color} size={16} />}
                <Text c={colors.steel[4]}>#{index + 1}</Text>
              </Group>
              {choice.link && (
                <ActionIcon
                  size={32}
                  radius={999}
                  component="a"
                  href={choice.link}
                  target="_blank"
                  rel="noreferrer"
                  variant="ghost-icon"
                >
                  <IconLink size={16} color={colors.steel[4]} />
                </ActionIcon>
              )}
            </Group>
            <Paper key={choice.id}>
              <Text c={colors.steel[0]} fw={600} fz="h2" mb="xs">
                {choice.title}
              </Text>
              <Divider mb="xs" />
              <Box mb={'sm'}>
                <Spoiler
                  // mah={250}
                  showLabel={
                    <Group gap={4} mt={8}>
                      <IconChevronDown size={16} color={colors.steel[0]} />
                      <Text fz="xs" c={colors.steel[0]} td="underline">
                        Show
                      </Text>
                    </Group>
                  }
                  hideLabel={
                    <Group gap={4} mt={8}>
                      <IconChevronUp size={16} color={colors.steel[0]} />
                      <Text fz="xs" c={colors.steel[0]} td="underline">
                        Hide
                      </Text>
                    </Group>
                  }
                >
                  {choice.description && (
                    <TipTapDisplay content={JSON.parse(choice.description)} />
                  )}
                </Spoiler>
              </Box>
              <Group pt="lg" gap={6}>
                <Text c={colors.steel[4]} fz="xs">
                  Posted by
                </Text>
                {choice.postedBy && (
                  <AddressAvatar
                    address={choice.postedBy as Address}
                    size={16}
                    gap="6"
                    fz="xs"
                  />
                )}
                <Text c={colors.steel[4]} fz="xs">
                  · {secondsToDate(choice.postedAt)}
                </Text>
              </Group>
            </Paper>
          </Box>
        ))
      ) : (
        <Paper variant="secondary">
          <Text c={colors.steel[2]} fz="sm">
            Choices have not been submitted yet
          </Text>
        </Paper>
      )}
    </Box>
  );
};
