import { toNano, beginCell } from '@ton/core';
import { bocToHash } from '../utils/boc-to-hash.ts';
import { walletClient } from '../ton-clients.ts';

export const setCounter = async (
  address: string,
): Promise<string | undefined> => {
  const account = walletClient.connection.account;

  if (!account) {
    return;
  }

  // alt to storeAdd function in the contract
  const payload = beginCell().store((builder) => {
    // id of Add function
    builder.storeUint(2335447074, 32);
    // queryId – an alternative to seqno
    builder.storeUint(1, 64);
    // amount
    builder.storeUint(1, 32);
  }).endCell();

  const res = await walletClient.connection.sendTransaction({
    validUntil: Date.now() + 5 * 60 * 1000,
    from: account.address,
    messages: [
      {
        address,
        amount: toNano('0.01').toString(),
        payload: payload.toBoc().toString('base64'),
      },
    ],
  });

  return bocToHash(res.boc);
};
