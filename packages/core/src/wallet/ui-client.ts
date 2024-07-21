import { TonConnectUI, TonConnectUiOptionsWithManifest } from '@tonconnect/ui';

import { ConnectUIFunctionUnavailableInNodeError } from '../shared/errors/syntax-errors.js';
import type { WalletClientUI } from './types.js';
import type { Chain } from '../shared/chains.js';
import { connectUI } from './ui-connect.js';
import { disconnect } from './disconnect.js';
import { getWallets } from './get-wallets.js';
import { sendTransaction } from './send-transaction.js';
import { onStatusChange } from './on-status-change.js';

interface CreateWalletClientUIOptionsBase {
  chain?: Chain;
}
interface CreateWalletClientUIOptionsWithTC extends CreateWalletClientUIOptionsBase {
  connection: TonConnectUI;
  manifestUrl?: never;
}
interface CreateWalletClientOptionsFull extends TonConnectUiOptionsWithManifest, CreateWalletClientUIOptionsBase {
  connection?: never;
}

export type CreateWalletClientUIOptions = CreateWalletClientOptionsFull | CreateWalletClientUIOptionsWithTC;

export function createWalletClientUI (options?: CreateWalletClientUIOptions): WalletClientUI {
  const { chain, ...tonConnectUIOptions } = options || {};

  if (typeof window === 'undefined') {
    throw new ConnectUIFunctionUnavailableInNodeError();
  }

  let connection: TonConnectUI;
  if ((tonConnectUIOptions as CreateWalletClientUIOptionsWithTC).connection) {
    connection = (tonConnectUIOptions as CreateWalletClientUIOptionsWithTC).connection;
  } else {
    connection = new TonConnectUI(tonConnectUIOptions as CreateWalletClientOptionsFull);
  }

  const client = {
    connection,
    connected: false,
    address: undefined,
  } as WalletClientUI;

  client.getWallets = getWallets.bind(client);

  client.connect = connectUI.bind(client);
  client.disconnect = disconnect.bind(client);

  client.sendTransaction = sendTransaction.bind(client);

  // Subscribe to wallet connection changes
  onStatusChange.call(client);

  return client;
}
