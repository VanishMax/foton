import type { Transaction, TransactionsByMessageResponse } from './types.ts';
import { TONCENTER_API_URL } from './constants.ts';

export const getTransactionsByMessageHash = async (hash: string): Promise<TransactionsByMessageResponse> => {
  const search = new URLSearchParams();
  search.set('direction', 'in');
  search.set('msg_hash', hash);

  const res = await fetch(`${TONCENTER_API_URL}/transactionsByMessage?${search.toString()}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  });

  return await res.json();
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
      if (res.transactions.length) {
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
