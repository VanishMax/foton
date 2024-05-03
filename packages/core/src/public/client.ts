import { createClient, type CreateClientOptions } from '@fotonjs/api';

import { waitForTransactionReceipt } from './wait-for-transaction-receipt.js';
import type { PublicClient } from './types.js';

export type CreatePublicClientOptions = CreateClientOptions;

export const createPublicClient = (options?: CreateClientOptions): PublicClient => {
  const apiClient = createClient(options);

  return {
    _api: apiClient,
    waitForTransactionReceipt: waitForTransactionReceipt.bind(null, apiClient),
  };
};
