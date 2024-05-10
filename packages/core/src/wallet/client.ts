import { TonConnect, type TonConnectOptions } from '@tonconnect/sdk';

import type { Chain } from '../shared/chains.js';

import type { WalletClient } from './types.js';
import { connect } from './connect.js';
import { disconnect } from './disconnect.js';
import { reconnect } from './reconnect.js';
import { getWallets } from './get-wallets.js';
import { sendTransaction } from './send-transaction.js';
import { onStatusChange } from './on-status-change.js';

interface CreateWalletClientOptionsBase {
  chain?: Chain;
}
interface CreateWalletClientOptionsWithTC extends CreateWalletClientOptionsBase {
  connection: TonConnect;
  manifestUrl?: never;
}
interface CreateWalletClientOptionsFull extends TonConnectOptions, CreateWalletClientOptionsBase {
  connection?: never;
}

export type CreateWalletClientOptions = CreateWalletClientOptionsFull | CreateWalletClientOptionsWithTC;

export function createWalletClient (options?: CreateWalletClientOptions): WalletClient {
  const { chain, ...tonConnectOptions } = options || {};

  let connection: TonConnect;
  if ((tonConnectOptions as CreateWalletClientOptionsWithTC).connection) {
    connection = (tonConnectOptions as CreateWalletClientOptionsWithTC).connection;
  } else {
    connection = new TonConnect(tonConnectOptions as CreateWalletClientOptionsFull);
  }

  const client = {
    connection,
    connected: false,
    address: undefined,
  } as WalletClient;

  client.getWallets = getWallets.bind(client);

  client.connect = connect.bind(client);
  client.disconnect = disconnect.bind(client);
  client.reconnect = reconnect.bind(client);

  client.sendTransaction = sendTransaction.bind(client);

  // Subscribe to wallet connection changes
  onStatusChange.call(client);

  return client;
}
