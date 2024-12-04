import { useMemo, useState } from 'react';
import { BasicChoiceFragment } from '../../generated/graphql';
import {
  Box,
  ColorSwatch,
  Group,
  Paper,
  Radio,
  Slider,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { ChoiceInputType } from '../../constants/enum';
import { TxButton } from '../TxButton';
import { useTx } from '../../hooks/useTx';
import { notifications } from '@mantine/notifications';
import { getSolPercentages } from '../../utils/units';
import { Address, encodeAbiParameters, parseAbiParameters } from 'viem';
import ContestAbi from '../../abi/Contest.json';

export const VoteSlider = ({
  answerType,
  choices,
  isActive,
  userPoints,
  userPointsDisplay,
  roundAddress,
  refetch,
}: {
  answerType: string;
  choices?: BasicChoiceFragment[];
  isActive: boolean;
  userPoints?: bigint;
  roundAddress?: string;
  userPointsDisplay?: string | null;
  refetch?: () => void;
}) => {
  const [values, setValues] = useState<Record<string, number>>({});
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const { colors } = useMantineTheme();

  const { tx } = useTx();

  const tokenDisplay = useMemo(() => {
    if (userPointsDisplay == null) {
      return <Text c={colors.steel[2]} fz="xs" mt="sm"></Text>;
    }
    if (userPointsDisplay === '0') {
      return (
        <Text c={colors.steel[2]} fz="xs" mt="sm">
          Your account does not have points to vote with
        </Text>
      );
    }

    return (
      <Text c={colors.steel[2]} fz="xs" mt="sm">
        Your account has {userPointsDisplay} points to vote with
      </Text>
    );
  }, [userPointsDisplay, colors]);

  const handleSliderChange = (id: string, newValue: number) => {
    const otherValuesTotal = Object.entries(values).reduce(
      (sum, [entryId, value]) => (id !== entryId ? sum + value : sum),
      0
    );
    const maxAllowed = 100 - otherValuesTotal;
    const clampedValue = Math.min(newValue, maxAllowed);
    setValues((prevValues) => ({ ...prevValues, [id]: clampedValue }));
  };

  const handleSubmit = () => {
    const choicesWithValues = Object.entries(values).filter(
      ([, value]) => value > 0
    );

    const percents = choicesWithValues.map(([, value]) => value);

    const emptyMetadata = [0n, ''] as const;

    const totalPercents = percents.reduce((acc, cur) => acc + cur, 0);

    console.log('totalPercents', totalPercents);
    console.log('answerType', answerType);

    if (totalPercents !== 100 && answerType === ChoiceInputType.Allocate) {
      notifications.show({
        title: 'Error',
        message: 'Total percentage must be 100',
        color: 'red',
      });
      return;
    }

    if (!userPoints || userPoints === 0n) {
      notifications.show({
        title: 'Error',
        message: 'You need points to vote',
        color: 'red',
      });
      return;
    }

    let choiceIds: string[] = [];
    let amounts: bigint[] = [];
    let sum = 0n;
    let encodedEmptyMetadata: string[] = [];

    if (answerType === ChoiceInputType.Allocate) {
      amounts = getSolPercentages(percents, userPoints as bigint);
      encodedEmptyMetadata = amounts.map(() =>
        encodeAbiParameters(parseAbiParameters('(uint256, string)'), [
          emptyMetadata,
        ])
      );
      sum = amounts.reduce((acc, curr) => acc + curr, 0n);
      choiceIds = choicesWithValues.map(([id]) => id);
    } else if (answerType === ChoiceInputType.Single) {
      if (!selectedChoice) {
        notifications.show({
          title: 'Error',
          message: 'You need to select a choice',
          color: 'red',
        });
        return;
      }
      choiceIds = [selectedChoice];
      amounts = [userPoints as bigint];
      encodedEmptyMetadata = [
        encodeAbiParameters(parseAbiParameters('(uint256, string)'), [
          emptyMetadata,
        ]),
      ];
      sum = userPoints as bigint;
    } else {
      notifications.show({
        title: 'Error',
        message: 'Invalid answer type',
        color: 'red',
      });
      return;
    }

    if (sum !== userPoints) {
      console.error('sum', sum);
      notifications.show({
        title: 'Error',
        message: 'Total amount must be equal to points',
        color: 'red',
      });
      return;
    }

    tx({
      writeContractParams: {
        abi: ContestAbi,
        functionName: 'batchVote',
        args: [choiceIds, amounts, encodedEmptyMetadata, sum, [9999999n, '']],
        address: roundAddress as Address,
      },
      writeContractOptions: {
        onPollSuccess() {
          refetch?.();
        },
      },
    });
  };

  return (
    <Box>
      <Paper mb="xl">
        <Text fw={600} c={colors.steel[0]} mb="2px">
          Answer
        </Text>
        {answerType === ChoiceInputType.Allocate && (
          <Text c={colors.steel[4]} fz="xs" mb="md">
            Adjust the sliders to distribute your vote
          </Text>
        )}
        {answerType === ChoiceInputType.Single && (
          <Text c={colors.steel[4]} fz="xs" mb="md">
            100% of your voting power will be allocated to that choice
          </Text>
        )}
        {answerType === ChoiceInputType.Allocate && (
          <Stack gap={'xl'}>
            {choices?.map((c, index) => {
              const currentValue = values[c.choiceId] || 0;
              return (
                <Box key={c.id}>
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
      <Group justify="center">
        <TxButton onClick={handleSubmit}>Submit Vote</TxButton>
      </Group>
    </Box>
  );
};
