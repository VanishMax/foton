import { createWalletClientUI, createPublicClient, createContractClient } from '@fotonjs/core';
import { SampleJetton } from '@fotonjs/contracts/jetton';
import { API_KEY } from './utils/constants.ts';

export const walletClient = createWalletClientUI({
  chain: 'testnet',
  manifestUrl: 'https://counter.foton.sh/tonconnect-manifest.json',
  restoreConnection: true,
});

export const publicClient = createPublicClient({
  api: 'testnet',
  authToken: API_KEY || undefined,
});

export const contractClient = createContractClient({
  contract: SampleJetton,
  publicClient,
  walletClient,
});
