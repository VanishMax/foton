import { createClient, type CreateClientOptions } from '@fotonjs/api';

import { waitForTransaction } from './wait-for-transaction.js';
import { getBalance } from './get-balance.js';
import type { PublicClient } from './types.js';

export type CreatePublicClientOptions = CreateClientOptions;

export const createPublicClient = (options?: CreateClientOptions): PublicClient => {
  const apiClient = createClient(options);

  const client = {
    _api: apiClient,
  } as PublicClient;

  client.waitForTransaction = waitForTransaction.bind(client);
  client.getBalance = getBalance.bind(client);

  return client;
};
