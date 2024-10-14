import { encodeAbiParameters, parseAbiParameters, zeroAddress } from 'viem';
import { HolderType } from '../constants/enum';
import { ADDR } from '../constants/address';
import { BasicChoice } from '../types/contractTypes';
import { CONTEST_V, ContestStatus, MODULES } from '../constants/chews';

const ONE_DAY = 60 * 60 * 24;

const fakeChoices: BasicChoice[] = [
  {
    metadata: {
      protocol: 6969420n,
      pointer: 'Choice 1',
    },
    data: '0x0000000000000000000000000000000000000000000000000000000000000000',
    exists: true,
    address: zeroAddress,
  },
  {
    metadata: {
      protocol: 6969420n,
      pointer: 'Choice 2',
    },
    data: '0x0000000000000000000000000000000000000000000000000000000000000000',
    exists: true,
    address: zeroAddress,
  },
  {
    metadata: {
      protocol: 6969420n,
      pointer: 'Choice 3',
    },
    data: '0x0000000000000000000000000000000000000000000000000000000000000000',
    exists: true,
    address: zeroAddress,
  },
];

export const testCreatePoll = (blockNumber: bigint, holderType: HolderType) => {
  const votesArgs = encodeAbiParameters(
    parseAbiParameters('uint256, bool, uint256'),
    [BigInt(ONE_DAY), true, BigInt(0)]
  );

  const pointsArgs = encodeAbiParameters(
    parseAbiParameters('address, uint256, uint8'),
    [ADDR.DAO, blockNumber, holderType]
  );

  const choicesArgs = encodeAbiParameters(
    parseAbiParameters(
      '((uint256, string), bytes, bool, address)[], bytes32[]'
    ),
    [
      [
        [
          [6969420n, 'Choice 1'],
          '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
          true,
          zeroAddress,
        ],
        [
          [6969420n, 'Choice 2'],
          '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
          true,
          zeroAddress,
        ],
        [
          [6969420n, 'Choice 3'],
          '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
          true,
          zeroAddress,
        ],
      ],
      ['0x1', '0x2', '0x3'],
    ]
  );

  const executeArgs = '0x';

  const initData = encodeAbiParameters(
    parseAbiParameters('bytes32[], string[]'),
    [
      [votesArgs, pointsArgs, choicesArgs, executeArgs],
      [
        MODULES.TIMED_VOTES,
        MODULES.BAAL_POINTS,
        MODULES.PRE_POP,
        MODULES.EMPTY_EX,
      ],
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
};
