import type { RpcClient } from '@fotonjs/api';

import type { waitForTransaction } from './wait-for-transaction.js';
import type { getBalance } from './get-balance.js';

export type { RpcClient };

export interface PublicClient {
  _api: RpcClient;
  waitForTransaction: typeof waitForTransaction;
  getBalance: typeof getBalance;
}
