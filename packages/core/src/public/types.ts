import type { RpcClient } from '@fotonjs/api';

import type { waitForTransactionReceipt } from './wait-for-transaction-receipt.js';
import type { getBalance } from './get-balance.js';

export type { RpcClient };

export interface PublicClient {
  _api: RpcClient;
  waitForTransactionReceipt: typeof waitForTransactionReceipt;
  getBalance: typeof getBalance;
}
