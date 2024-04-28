import { TonConnect } from '@tonconnect/sdk';

import type { WalletClient } from './types.js';
import type { Chain } from '../shared/chains.js';
import { connect } from './connect.js';
import { disconnect } from './disconnect.js';
import { reconnect } from './reconnect.js';
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

  client.getWallets = getWallets.bind(client);

  client.connect = connect.bind(client);
  client.disconnect = disconnect.bind(client);
  client.reconnect = reconnect.bind(client);

  // Manage wallet connection status and execute callbacks from the connect and reconnect functions
  client._connectionCallbacks = [];
  connection.onStatusChange((wallet) => {
    if (wallet) {
      client.connected = true;
      client.address = wallet.account.address;
    } else {
      client.connected = false;
      client.address = undefined;
    }
    client._connectionCallbacks.forEach((cb) => cb(wallet));
  }, (error) => {
    client._connectionCallbacks.forEach((cb) => cb(error));
  });

  return client;
}
