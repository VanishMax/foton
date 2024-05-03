import { createWalletClientUI, createPublicClient, createContractClient } from '@fotonjs/core';
import fotonClient from '@fotonjs/client';

export const walletClient = createWalletClientUI({
  manifestUrl: 'https://photon-counter.vercel.app/tonconnect-manifest.json',
  restoreConnection: true,
});

export const publicClient = createPublicClient({
  chain: 'testnet',
});

export const counterClient = createContractClient({
  contract: fotonClient.counter,
  publicClient,
  walletClient,
  address: localStorage.getItem('counterAddress') as string || undefined
});
