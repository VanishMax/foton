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

let globalClient: WalletClientUI;

export function createWalletClientUI (options?: CreateWalletClientUIOptions): WalletClientUI {
  const { chain, ...tonConnectUIOptions } = options || {};

  if (typeof window === 'undefined') {
    throw new ConnectUIFunctionUnavailableInNodeError();
  }

  if (globalClient) {
    return globalClient;
  }

  const client = {
    connected: false,
    address: undefined,
  } as WalletClientUI;

  if ((tonConnectUIOptions as CreateWalletClientUIOptionsWithTC).connection) {
    client.connection = (tonConnectUIOptions as CreateWalletClientUIOptionsWithTC).connection;
  } else {
    client.connection = new TonConnectUI(tonConnectUIOptions as CreateWalletClientOptionsFull);
  }

  client.getWallets = getWallets.bind(client);

  client.connect = connectUI.bind(client);
  client.disconnect = disconnect.bind(client);

  client.sendTransaction = sendTransaction.bind(client);

  // Subscribe to wallet connection changes
  onStatusChange.call(client);

  globalClient = client;
  return client;
}
