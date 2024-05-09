import { createWalletClientUI, createPublicClient, createContractClient } from '@fotonjs/core';
import fotonClient from '@fotonjs/client';

export const walletClient = createWalletClientUI({
  chain: 'testnet',
  manifestUrl: 'https://counter.foton.sh/tonconnect-manifest.json',
  restoreConnection: true,
});

export const publicClient = createPublicClient({
  api: 'testnet',
});

export const counterClient = createContractClient({
  contract: fotonClient.counter,
  publicClient,
  walletClient,
  address: localStorage.getItem('counterAddress') as string || undefined
});
