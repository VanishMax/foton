# Foton

_Foton tends to be a fundamental toolset to a TON ecosystem just like photon is a fundamental particle in physics._

> Warning: This project is under active development and is not ready for production use. Each release might and probably will contain breaking changes. If you find bugs when using it, please submit an issue.

A family of TypeScript libraries for rapid app development on TON blockchain. Heavily inspired by [Viem](https://viem.sh/) in Ethereum, Foton aims to provide the best developer experience to the TON community.  

The toolset consists of:
1. `@fotonjs/core` – a library for interacting with TON blockchain and smart contracts.
2. `@fotonjs/cli` (under construction) for compiling, testing and deploying smart contracts.
3. `@fotonjs/api` – a wrapper around the [TON Center v3](https://toncenter.com/) API.

## Core

The core library provides a set of clients for communicating with the TON blockchain: **public client** allows makes requests to read data from the blockchain, **wallet client** allows dApps to connect to the wallet, sign and send transactions, **contract client** allows contract interactions like deploy, calling methods and getters.

To get started, install the core library:

```bash
npm install @fotonjs/core

# or
yarn add @fotonjs/core

# or
pnpm add @fotonjs/core
```

Now, you can create public, wallet, or contract client and interact with TON:

```ts
// Import Foton client creators
import { createPublicClient, createWalletClient, createContractClient } from '@fotonjs/core';

// Import smart contract compiled from Tact or FunC language
import counterContract from './contracts/Counter.ts';

export const walletClient = createWalletClient({
  manifestUrl: 'https://example.com/tonconnect-manifest.json',
});
const userWallet = await walletClient.connect();

export const publicClient = createPublicClient({
  api: 'mainnet',
});

const { data: hash } = await walletClient.sendTransaction({
  to: '0:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  value: 1000000000n,
});
const { data: transaction } = await publicClient.waitForTransaction({ hash: txHash });

export const counterClient = createContractClient({
  contract: counterContract,
  publicClient,
  walletClient,
});

const { data: { address } } = await counterClient.deploy({
  value: 1000000000n,
  arguments: [],
  payload: { queryId: 1n },
});

await counterContract.write({
  value: 1000000000n,
  method: 'increment',
  payload: { queryId: 2n },
});

const { data: counterValue } = await counterContract.read({
  method: 'counter',
  arguments: [],
});
```

## License

The source code is licensed under the terms of [MIT License](./LICENSE). 2024, Max Korsunov.
