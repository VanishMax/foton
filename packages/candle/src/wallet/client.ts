import { TonConnect } from '@tonconnect/sdk';

import type { WalletClient } from './types.js';
import type { Chain } from '../shared/chains.js';
import { connect } from './connect.js';
import { getWallets } from './get-wallets.js';

export interface CreateWalletClientOptions {
  chain?: Chain;
  manifestUrl: string;
}

export function createWalletClient (options?: CreateWalletClientOptions): WalletClient {
  const { manifestUrl } = options || {};

  // TODO: configure the storage and other options of the connector
  const connection = new TonConnect({
    manifestUrl,
  });

  const client = {
    connection,
    connected: false,
    address: undefined,
  } as WalletClient;

  client.reconnect = connection.restoreConnection;
  client.disconnect = connection.disconnect;
  client.getWallets = getWallets.bind(client);
  client.connect = connect.bind(client);

  return client;
}
