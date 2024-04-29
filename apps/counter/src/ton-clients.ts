import { createWalletClientUI, createPublicClient } from '@foton/candle';

export const walletClient = createWalletClientUI({
  manifestUrl: 'https://photon-counter.vercel.app/tonconnect-manifest.json',
  restoreConnection: true,
});

export const publicClient = createPublicClient({
  chain: 'testnet',
});
