import type { TonConnect, WalletInfo } from '@tonconnect/sdk';

import type { ConnectOptions } from './connect.js';
import type { GetWalletsOptions } from './get-wallets.js';

export type { WalletInfo };

export interface WalletClient {
  address?: string;
  connected: boolean;

  connection: TonConnect;
  wallets?: WalletInfo[];
  getWallets: (options?: GetWalletsOptions) => Promise<WalletInfo[]>;

  connect: (connector: WalletInfo, options?: ConnectOptions) => Promise<UserClient>;
  reconnect: VoidFunction;
  disconnect: VoidFunction;
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
