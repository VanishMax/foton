import type { TonConnect, Wallet, WalletInfo } from '@tonconnect/sdk';
import type { TonConnectUI } from '@tonconnect/ui';

import type { Chain } from '../shared/chains.js';

import type { getWallets } from './get-wallets.js';
import type { connect } from './connect.js';
import type { connectUI } from './ui-connect.js';
import type { reconnect } from './reconnect.js';
import type { disconnect } from './disconnect.js';
import type { sendTransaction } from './send-transaction.js';

export type { WalletInfo, Wallet };

export interface WalletClientBase {
  _chain: Chain;
  _connectionCallbacks: ((wallet: Error | Wallet | null) => void)[];

  address?: string;
  connected: boolean;

  connection: TonConnect | TonConnectUI;
  wallets?: WalletInfo[];

  getWallets: typeof getWallets;
  disconnect: typeof disconnect;
  sendTransaction: typeof sendTransaction;
}

export interface WalletClient extends WalletClientBase {
  connect: typeof connect;
  reconnect: typeof reconnect;
}

export interface WalletClientUI extends WalletClientBase {
  connect: typeof connectUI;
}
