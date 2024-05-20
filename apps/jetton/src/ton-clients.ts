import { createWalletClientUI, createPublicClient } from '@fotonjs/core';

export const walletClient = createWalletClientUI({
  chain: 'testnet',
  manifestUrl: 'https://jetton.foton.sh/tonconnect-manifest.json',
  restoreConnection: true,
});

export const publicClient = createPublicClient({
  api: 'testnet',
});

// export const counterClient = createContractClient({
//   contract: fotonClient.counter,
//   publicClient,
//   walletClient,
// });
