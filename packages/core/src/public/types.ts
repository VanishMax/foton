import type { RpcClient } from '@fotonjs/api';

import type { Transaction } from '../shared/types.js';
import type { WaitForTransactionReceiptOptions } from './wait-for-transaction-receipt.js';

export type { RpcClient };

export interface PublicClient {
  _api: RpcClient;
  waitForTransactionReceipt: (txHash: string, options?: WaitForTransactionReceiptOptions) => Promise<Transaction | undefined>;
}
