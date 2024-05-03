import type { Transaction } from '@fotonjs/api';
import type { RpcClient } from './types.js';

const getTransactionsByMessageHash = async (api: RpcClient, hash: string) => {
  const res = await api.transactionsByMessage({
    direction: 'in',
    msg_hash: hash,
  });

  return res.data;
};

export interface WaitForTransactionReceiptOptions {
  refetchInterval?: number;
  refetchLimit?: number;
}

export const waitForTransactionReceipt = async (
  api: RpcClient,
  hash: string,
  options?: WaitForTransactionReceiptOptions,
): Promise<Transaction | undefined> => {
  const { refetchInterval = 1000, refetchLimit = undefined } = options || {};

  return new Promise((resolve) => {
    let refetches = 0;

    const interval = setInterval(async () => {
      refetches += 1;
      const res = await getTransactionsByMessageHash(api, hash);
      if (res?.transactions.length) {
        clearInterval(interval);
        resolve(res.transactions[0]);
      }

      if (refetchLimit && refetches >= refetchLimit) {
        clearInterval(interval);
        resolve(undefined);
      }
    }, refetchInterval);
  });
};
