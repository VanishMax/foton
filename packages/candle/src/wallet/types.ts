import type { TonConnect, Wallet, WalletInfo } from '@tonconnect/sdk';

import type { ConnectOptions } from './connect.js';
import type { GetWalletsOptions } from './get-wallets.js';

export type { WalletInfo, Wallet };

export interface WalletClient {
  _connectionCallbacks: ((wallet: Error | Wallet | null) => void)[];

  address?: string;
  connected: boolean;

  connection: TonConnect;
  wallets?: WalletInfo[];
  getWallets: (options?: GetWalletsOptions) => Promise<WalletInfo[]>;

  connect: (connector: WalletInfo, options?: ConnectOptions) => Promise<Wallet>;
  reconnect: () => Promise<Wallet>
  disconnect: () => Promise<void>;
  user?: UserClient;
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
