import type { Transaction } from '@foton/api';
import { publicClient } from './publicClient.ts';

export const getTransactionsByMessageHash = async (hash: string) => {
  const res = await publicClient.transactionsByMessage({
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
  hash: string,
  options?: WaitForTransactionReceiptOptions,
): Promise<Transaction | undefined> => {
  const { refetchInterval = 1000, refetchLimit = undefined } = options || {};

  return new Promise((resolve) => {
    let refethes = 0;

    const interval = setInterval(async () => {
      refethes += 1;
      const res = await getTransactionsByMessageHash(hash);
      if (res?.transactions.length) {
        clearInterval(interval);
        resolve(res.transactions[0]);
      }

      if (refetchLimit && refethes >= refetchLimit) {
        clearInterval(interval);
        resolve(undefined);
      }
    }, refetchInterval);
  });
};
