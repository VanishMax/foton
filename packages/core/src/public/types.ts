export type { RpcClient } from '@foton/api';

import type { Transaction } from '../shared/types.js';
import type { WaitForTransactionReceiptOptions } from './wait-for-transaction-receipt.js';

export interface PublicClient {
  waitForTransactionReceipt: (txHash: string, options?: WaitForTransactionReceiptOptions) => Promise<Transaction | undefined>;
}
