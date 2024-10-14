export const MODULES = {
  BAAL_POINTS: 'BaalPoints_v0.2.0',
  BAAL_GATE: 'BaalGate_v0.2.0',
  PRE_POP: 'PrePop_v0.2.0',
  EMPTY_EX: 'EmptyExecution_v0.2.0',
  TIMED_VOTES: 'TimedVotes_v0.2.0',
};

export const CONTEST_V = '0.2.0';

export enum ContestStatus {
  None,
  Populating,
  Voting,
  Continuous,
  Finalized,
  Executed,
}
