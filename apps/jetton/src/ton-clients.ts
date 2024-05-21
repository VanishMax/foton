import { createWalletClientUI, createPublicClient, createContractClient } from '@fotonjs/core';
import { SampleJetton } from './contract';

export const walletClient = createWalletClientUI({
  chain: 'testnet',
  manifestUrl: 'https://counter.foton.sh/tonconnect-manifest.json',
  restoreConnection: true,
});

export const publicClient = createPublicClient({
  api: 'testnet',
});

export const counterClient = createContractClient({
  contract: SampleJetton,
  publicClient,
  walletClient,
});
