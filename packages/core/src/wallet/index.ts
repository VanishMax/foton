export { createWalletClient } from './client.js';
export { createWalletClientUI } from './ui-client.js';

export type { CreateWalletClientOptions } from './client.js';
export type { CreateWalletClientUIOptions } from './ui-client.js';
export type { SendTransactionOptions } from './send-transaction.js';
export type { DeployContractOptions } from '../contract/deploy-contract.js';
export type { GetWalletsOptions } from './get-wallets.js';

export type {
  WalletClient,
  WalletClientUI,
  WalletInfo,
  WalletClientBase,
  Wallet,
} from './types.js';
