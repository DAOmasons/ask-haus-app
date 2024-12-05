import {
  Address,
  createPublicClient,
  encodeAbiParameters,
  Hex,
  http,
  isHex,
  pad,
  parseAbiParameters,
  parseEther,
  stringToHex,
  zeroAddress,
} from 'viem';
import {
  contentProtocol,
  ContentType,
  HolderType,
  IndexerKey,
} from '../constants/enum';
import { ADDR } from '../constants/address';
import { CONTEST_V, ContestStatus, MODULES } from '../constants/chews';
import { appNetwork } from './connect';
import { FormChoice } from '../types/ui';
import {
  basicChoiceSchema,
  contestMetadataSchema,
  pollMetadataSchema,
} from '../schema/form/create';
import { isBytes32, randomCharacters } from './helpers';
import { Content } from '@tiptap/react';

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
type TimedVoteArgs = {
  duration: number;
  autostart: boolean;
  startTime: number;
};

export const encodeTimedVoteArgs = ({
  duration,
  startTime,
  autostart,
}: TimedVoteArgs) => {
  const args = encodeAbiParameters(
    parseAbiParameters('uint256, bool, uint256'),
    [BigInt(duration), autostart, BigInt(startTime)]
  );
  return args;
};

type PointsArgsType = {
  holderType: HolderType;
  dao: Address;
  blockTimestamp: number | 'now';
};
export const encodePointsArgs = async ({
  blockTimestamp,
  dao,
  holderType,
}: PointsArgsType) => {
  // starts in the past to prevent checkpoint not mined errors

  let timestamp;

  if (blockTimestamp === 'now') {
    const publicClient = createPublicClient({
      chain: appNetwork,
      transport: http(import.meta.env.VITE_RPC_URL),
    });
    const block = await publicClient.getBlock();

    timestamp = BigInt(block.timestamp);
  } else {
    timestamp = BigInt(blockTimestamp);
  }

  const args = encodeAbiParameters(
    parseAbiParameters('address, uint256, uint8'),
    [dao, timestamp, Number(holderType)]
  );
  return args;
};

type PrepopChoicesArgsType = {
  formChoices: FormChoice[];
  contentType: ContentType;
};

export const encodePrepopChoicesArgs = ({
  formChoices,
  contentType,
}: PrepopChoicesArgsType) => {
  const solChoices = formChoices.map((choice) => {
    const validated = basicChoiceSchema.safeParse(choice);
    if (!validated.success) {
      throw new Error('Invalid choice data');
    }
    const protocol = contentProtocol[contentType];
    return [
      [protocol, JSON.stringify(validated.data)],
      '0x0',
      true,
      zeroAddress,
    ] as [[bigint, string], Hex, boolean, Address];
  });

  const choiceIds = formChoices.map((choice) => {
    if (isBytes32(choice.id) && isHex(choice.id)) {
      return choice.id;
    } else {
      throw new Error('Invalid choice id');
    }
  });

  const encoded = encodeAbiParameters(
    parseAbiParameters(
      '((uint256, string), bytes, bool, address)[], bytes32[]'
    ),
    [solChoices, choiceIds]
  );

  return encoded;
};

type BaalChoiceArgs = {
  daoAddress: Address;
  startTime: number;
  duration: number;
  holderType: HolderType;
  holderThreshold: number;
};

export const baalChoiceArgs = async (args: BaalChoiceArgs) => {
  const publicClient = createPublicClient({
    chain: appNetwork,
    transport: http(import.meta.env.VITE_RPC_URL),
  });
  const block = await publicClient.getBlock();

  const timestamp = BigInt(block.timestamp);

  // (
  //           address _daoAddress,
  //           uint256 _startTime,
  //           uint256 _duration,
  //           HolderType _holderType,
  //           uint256 _checkpoint,
  //           uint256 _holderThreshold
  //       )

  const encoded = encodeAbiParameters(
    parseAbiParameters('address, uint256, uint256, uint8, uint256, uint256'),
    [
      args.daoAddress,
      BigInt(args.startTime),
      BigInt(args.duration),
      Number(args.holderType),
      BigInt(timestamp),
      parseEther(args.holderThreshold.toString()),
    ]
  );

  return encoded;
};

export const emptyExecuteArgs = (): Hex => '0x0';

type PollArgs = {
  pollMetadata: {
    title: string;
    description?: string;
    pollLink?: string;
    contentType: ContentType;
    answerType: string;
    requestComment: boolean;
  };
} & TimedVoteArgs &
  PointsArgsType &
  PrepopChoicesArgsType;

export const createPollArgs = async (args: PollArgs) => {
  const encodedTimedVoteArgs = encodeTimedVoteArgs(args);
  const encodedBaalPointsArgs = await encodePointsArgs(args);
  const encodedPrepopChoicesArgs = encodePrepopChoicesArgs(args);
  const encodedExecuteArgs = emptyExecuteArgs();

  const initData = encodeAbiParameters(
    parseAbiParameters('string[4], bytes[4]'),
    [
      [
        MODULES.TIMED_VOTES,
        MODULES.BAAL_POINTS,
        MODULES.PRE_POP,
        MODULES.EMPTY_EX,
      ],
      [
        encodedTimedVoteArgs,
        encodedBaalPointsArgs,
        encodedPrepopChoicesArgs,
        encodedExecuteArgs,
      ],
    ]
  );

  const validated = pollMetadataSchema.safeParse(args.pollMetadata);
  if (!validated.success) {
    throw new Error('Invalid poll metadata');
  }
  const content = JSON.stringify(validated.data);
  const protocol = contentProtocol[args.pollMetadata.contentType];

  const filterTag = `${IndexerKey.PollV0}_${randomCharacters()}`;

  return {
    args: [
      [protocol, content],
      initData,
      CONTEST_V,
      ContestStatus.Voting,
      false,
      filterTag,
    ],
    filterTag,
  };
};

type ContestArgs = {
  metadata: {
    title: string;
    description: Content;
    link?: string;
    answerType: string;
    contentType: ContentType;
    requestComment: boolean;
  };
  baalChoicesArgs: BaalChoiceArgs;
  timedVoteArgs: TimedVoteArgs;
  pointsArgs: PointsArgsType;
};

export const createContestArgs = async (args: ContestArgs) => {
  const encodedVoteArgs = encodeTimedVoteArgs(args.timedVoteArgs);
  const encodedPointsArgs = await encodePointsArgs(args.pointsArgs);
  const encodedChoicesArgs = await baalChoiceArgs(args.baalChoicesArgs);
  const encodedExecuteArgs = emptyExecuteArgs();

  const initData = encodeAbiParameters(
    parseAbiParameters('string[4], bytes[4]'),
    [
      [
        MODULES.TIMED_VOTES,
        MODULES.BAAL_POINTS,
        MODULES.BAAL_GATE,
        MODULES.EMPTY_EX,
      ],
      [
        encodedVoteArgs,
        encodedPointsArgs,
        encodedChoicesArgs,
        encodedExecuteArgs,
      ],
    ]
  );

  const validated = contestMetadataSchema.safeParse(args.metadata);

  if (!validated.success) {
    throw new Error('Invalid poll metadata');
  }

  const content = JSON.stringify(validated.data);
  const protocol = contentProtocol[args.metadata.contentType];

  const filterTag = `${IndexerKey.ContestV0}_${randomCharacters()}`;

  return {
    args: [
      [protocol, content],
      initData,
      CONTEST_V,
      ContestStatus.Continuous,
      false,
      filterTag,
    ],
    filterTag,
  };
};
