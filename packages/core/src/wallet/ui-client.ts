import { TonConnectUI, type TonConnectUiOptionsWithManifest } from '@tonconnect/ui';

import type { WalletClientUI } from './types.js';
import type { Chain } from '../shared/chains.js';
import { connectUI } from './ui-connect.js';
import { disconnect } from './disconnect.js';
import { getWallets } from './get-wallets.js';
import { sendTransaction } from './send-transaction.js';
import { deployContract } from './deploy-contract.js';
import { onStatusChange } from './on-status-change.js';

export interface CreateWalletClientUIOptions extends TonConnectUiOptionsWithManifest {
  chain?: Chain;
}

export function createWalletClientUI (options?: CreateWalletClientUIOptions): WalletClientUI {
  const { chain, ...tonConnectUIOptions } = options || {};

  const connection = new TonConnectUI(tonConnectUIOptions);

  const client = {
    connection,
    connected: false,
    address: undefined,
  } as WalletClientUI;

  client.getWallets = getWallets.bind(client);

  client.connect = connectUI.bind(client);
  client.disconnect = disconnect.bind(client);

  client.sendTransaction = sendTransaction.bind(client);
  client.deployContract = deployContract.bind(client);

  // Subscribe to wallet connection changes
  onStatusChange.call(client);

  return client;
}
