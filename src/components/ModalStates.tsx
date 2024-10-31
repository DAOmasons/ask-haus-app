import { Box, Flex, Spoiler, Text, useMantineTheme } from '@mantine/core';
import {
  IconBolt,
  IconCake,
  IconFidgetSpinner,
  IconFlame,
  IconHandRock,
  IconMoodSmile,
  IconSkull,
} from '@tabler/icons-react';
import classes from '../styles/animation.module.css';
import { useMemo } from 'react';
import { charLimit } from '../utils/helpers';

export const LoadingState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <Flex align={'center'} mt="md" direction={'column'}>
      <IconFidgetSpinner size={60} className={classes.spinGlow} />
      <Text fz="lg" my="md" className={classes.glow} fw={600}>
        {title}
      </Text>
      <Text pb="xl" className={classes.glow}>
        {description}
      </Text>
    </Flex>
  );
};

export const TimeoutState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <Flex align={'center'} mt="md" direction={'column'}>
      <Box style={{ transform: 'rotate(180deg)' }}>
        <IconMoodSmile size={60} />
      </Box>
      <Text fz="lg" my="md" fw={600}>
        {title}
      </Text>
      <Text pb="xl">{description}</Text>
    </Flex>
  );
};

export const ErrorState = ({
  title,
  description,
  errMsg,
}: {
  title: string;
  description: string;
  errMsg?: string;
}) => {
  const { colors } = useMantineTheme();
  return (
    <Flex align={'center'} mt="md" direction={'column'}>
      <IconSkull size={60} />
      <Text fz="lg" my="md" fw={600}>
        {title}
      </Text>
      <Text pb="xl">{description}</Text>
      {errMsg && (
        <Spoiler
          showLabel={
            <Text fz={'xs'} c={colors.steel[2]}>
              Read Error
            </Text>
          }
          hideLabel={
            <Text fz="xs" c={colors.steel[3]}>
              Hide
            </Text>
          }
          fz="sm"
          className="ws-pre-wrap"
          w={'80%'}
          maxHeight={0}
        >
          {charLimit(errMsg, 1000)}
        </Spoiler>
      )}
    </Flex>
  );
};

const successIcons = [
  IconCake,
  IconMoodSmile,
  IconHandRock,
  IconBolt,
  IconFlame,
];

export const SuccessState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const RandomIcon = useMemo(() => {
    const index = Math.floor(Math.random() * successIcons.length);
    return successIcons[index];
  }, []);

  return (
    <Flex align={'center'} mt="md" direction={'column'}>
      <RandomIcon size={60} />
      <Text fz="lg" my="md" fw={600}>
        {title}
      </Text>
      <Text pb="xl">{description}</Text>
    </Flex>
  );
};
