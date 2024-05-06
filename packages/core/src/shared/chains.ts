import { CHAIN } from '@tonconnect/sdk';

export type Chain = 'mainnet' | 'testnet';

const chainMap: Record<Chain, CHAIN> = {
  mainnet: CHAIN.MAINNET,
  testnet: CHAIN.TESTNET,
};

export const getNetwork = (chain: Chain): CHAIN => {
  return chainMap[chain];
};
