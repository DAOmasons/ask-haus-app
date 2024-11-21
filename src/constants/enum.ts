export enum HolderType {
  None,
  Share,
  Loot,
  Both,
}

export enum VoteType {
  Poll,
  Contest,
  SignalSession,
}

export enum ChoiceInputType {
  Single = 'Single Choice',
  Allocate = 'Allocation (%)',
}

export const contentProtocol = {
  onchain: 6969420n,
  ipfs: 1n,
};

export type ContentType = keyof typeof contentProtocol;

export enum IndexerKey {
  PollV0 = 'askhaus-poll-v0',
  ContestV0 = 'askhaus-contest-v0',
}
