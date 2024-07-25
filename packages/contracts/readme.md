# @fotonjs/contracts

A collection of smart contracts ready-to-use by Foton.

```ts
import { createWalletClientUI, createPublicClient, createContractClient } from '@fotonjs/core';
import { SimpleCounter } from '@fotonjs/contracts/counter';

export const walletClient = createWalletClientUI({
  chain: 'testnet',
  manifestUrl: 'https://counter.foton.sh/tonconnect-manifest.json',
  restoreConnection: true,
});

export const publicClient = createPublicClient({
  api: 'testnet',
});

export const counterClient = createContractClient({
  contract: SimpleCounter, // Notice the use of the imported counter contract
  publicClient,
  walletClient,
});
```
