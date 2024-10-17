import {
  encodeAbiParameters,
  pad,
  parseAbiParameters,
  stringToHex,
  zeroAddress,
} from 'viem';
import { HolderType } from '../constants/enum';
import { ADDR } from '../constants/address';
import { CONTEST_V, ContestStatus, MODULES } from '../constants/chews';

const ONE_DAY = 60 * 60 * 24;

export const pollTestArgs = (blockTimestamp: bigint) => {
  const votesArgs = encodeAbiParameters(
    parseAbiParameters('uint256, bool, uint256'),
    [BigInt(ONE_DAY), true, BigInt(0)]
  );

  const pointsArgs = encodeAbiParameters(
    parseAbiParameters('address, uint256, uint8'),
    [ADDR.DAO, blockTimestamp, HolderType.Both]
  );

  const choicesArgs = encodeAbiParameters(
    parseAbiParameters(
      '((uint256, string), bytes, bool, address)[], bytes32[]'
    ),
    [
      [
        [[6969420n, 'Choice 1'], '0x0', true, zeroAddress],
        [[6969420n, 'Choice 2'], '0x0', true, zeroAddress],
        [[6969420n, 'Choice 3'], '0x0', true, zeroAddress],
      ],
      [
        pad(stringToHex('choice1'), { size: 32 }),
        pad(stringToHex('choice2'), { size: 32 }),
        pad(stringToHex('choice3'), { size: 32 }),
      ],
    ]
  );

  const executeArgs = '0x0';

  const initData = encodeAbiParameters(
    parseAbiParameters('string[4], bytes[4]'),
    [
      [
        MODULES.TIMED_VOTES,
        MODULES.BAAL_POINTS,
        MODULES.PRE_POP,
        MODULES.EMPTY_EX,
      ],
      [votesArgs, pointsArgs, choicesArgs, executeArgs],
    ]
  );

  const args = [
    [6969420n, 'Poll Metadata'],
    initData,
    CONTEST_V,
    ContestStatus.Voting,
    false,
    'Test1',
  ];

  return args;
};
