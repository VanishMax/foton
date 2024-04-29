import { toNano, storeStateInit, beginCell } from '@ton/core';
import type { Hex } from '../public-api/types.ts';
import type { ExtendedContract } from './types.ts';
import { walletClient } from '../ton-clients.ts';

export const deployContract = async <CONTRACT extends ExtendedContract>(
  contract: CONTRACT,
): Promise<Hex | undefined> => {
  const account = walletClient.connection.account;

  const fullContract = await contract.fromInit();

  if (!account || !fullContract.init?.code || !fullContract.init?.data) {
    return;
  }

  const stateInitBuilder = beginCell();
  storeStateInit({ code: fullContract.init.code, data: fullContract.init.data })(stateInitBuilder);
  const stateInit = stateInitBuilder.endCell().toBoc().toString("base64");

  // Taken from storeDeploy function, queryId became 10002 – an alternative to seqno
  const payloadBuilder = beginCell().storeUint(2490013878, 32).storeUint(10002, 64).endCell();

  const contractAddress = fullContract.address.toString() as Hex;
  await walletClient.connection.sendTransaction({
    validUntil: Date.now() + 5 * 60 * 1000,
    from: account.address,
    messages: [
      {
        address: contractAddress,
        amount: toNano('0.05').toString(),
        payload: payloadBuilder.toBoc().toString('base64'),
        stateInit,
      },
    ],
  });

  return contractAddress;
};
