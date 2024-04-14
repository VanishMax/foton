import { toNano, beginCell } from '@ton/core';
import type { TonConnectUI } from '@tonconnect/ui-react';
import type { Hex } from '../public-api/types.ts';
import { bocToHash } from '../utils/boc-to-hash.ts';

export const setCounter = async (
  address: Hex,
  connection: TonConnectUI,
): Promise<string | undefined> => {
  const account = connection.account;

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

  const res = await connection.sendTransaction({
    validUntil: Date.now() + 5 * 60 * 1000,
    from: connection.account.address,
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
