import { createClient } from '@foton/api';

import { waitForTransactionReceipt } from './wait-for-transaction-receipt.js';
import type { PublicClient } from './types.js';
import type { Chain } from '../shared/chains.js';

export interface CreatePublicClientOptions {
  chain?: Chain;
}

export const createPublicClient = (options?: CreatePublicClientOptions): PublicClient => {
  const apiClient = createClient(options);

  return {
    _api: apiClient,
    waitForTransactionReceipt: waitForTransactionReceipt.bind(null, apiClient),
  };
};
