import type { TonConnect, Wallet, WalletInfo } from '@tonconnect/sdk';
import type { TonConnectUI } from '@tonconnect/ui';

import type { GetWalletsOptions } from './get-wallets.js';

export type { WalletInfo, Wallet };

export interface WalletClientBase {
  _connectionCallbacks: ((wallet: Error | Wallet | null) => void)[];

  address?: string;
  connected: boolean;

  connection: TonConnect | TonConnectUI;
  wallets?: WalletInfo[];
  getWallets: (options?: GetWalletsOptions) => Promise<WalletInfo[]>;

  disconnect: () => Promise<void>;
  user?: UserClient;
}

export interface WalletClient extends WalletClientBase {
  connect: (connector: WalletInfo) => Promise<Wallet>;
  reconnect: () => Promise<Wallet>;
}

export interface WalletClientUI extends WalletClientBase {
  connect: (connector?: WalletInfo) => Promise<Wallet>;
}

export interface UserClient extends WalletClient {
  address: string;
  sendTransaction: (args: TransactionArgs) => Promise<string>;
  deployContract: (contract: ContractArgs) => Promise<string>;
}

interface TransactionArgs {
  account?: string; // no need when using UserClient
  to: string;
  value: bigint;
}

interface ContractArgs {
  account?: string; // no need when using UserClient
  // TODO: create type CompiledContract extending what is returned from the Tact compilation
  contract: any;
  value: bigint;
}
