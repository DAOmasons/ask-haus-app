export type Metadata = {
  protocol: bigint;
  pointer: string;
};

export type BasicChoice = {
  metadata: Metadata;
  data: string; // bytes
  exists: boolean;
  address: string;
};
