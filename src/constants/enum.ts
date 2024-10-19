export enum HolderType {
  None,
  Share,
  Loot,
  Both,
}

export const contentProtocol = {
  onchain: 6969420n,
  ipfs: 1n,
};

export type ContentType = keyof typeof contentProtocol;
