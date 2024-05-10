import type { Transaction } from '@fotonjs/api';
import type { PublicClient, RpcClient } from './types.js';

const getTransactionsByMessageHash = async (api: RpcClient, hash: string) => {
  const res = await api.transactionsByMessage({
    direction: 'in',
    msg_hash: hash,
  });

  return res.data;
};

export interface WaitForTransactionOptions {
  hash: string;
  refetchInterval?: number;
  refetchLimit?: number;
}

export async function waitForTransaction (
  this: PublicClient,
  options: WaitForTransactionOptions,
): Promise<Transaction | undefined> {
  const { hash, refetchInterval = 1000, refetchLimit = undefined } = options || {};

  return new Promise((resolve) => {
    let refetches = 0;

    const interval = setInterval(async () => {
      refetches += 1;
      const res = await getTransactionsByMessageHash(this._api, hash);
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
}
