import { Contract, toNano, storeStateInit, beginCell } from '@ton/core';
import type { TonConnectUI } from '@tonconnect/ui-react';

interface ExtendedContract {
  fromInit(): Promise<Contract>;
}

export const deployContract = async <CONTRACT extends ExtendedContract>(
  contract: CONTRACT,
  connection: TonConnectUI,
): Promise<string | undefined> => {
  const account = connection.account;

  const fullContract = await contract.fromInit();

  if (!account || !fullContract.init?.code || !fullContract.init?.data) {
    return;
  }

  const stateInitBuilder = beginCell();
  storeStateInit({ code: fullContract.init.code, data: fullContract.init.data })(stateInitBuilder);
  const stateInit = stateInitBuilder.endCell().toBoc().toString("base64");

  const payloadBuilder = beginCell().storeUint(2490013878, 32).storeUint(10002, 64).endCell();

  const contractAddress = fullContract.address.toString();
  await connection.sendTransaction({
    validUntil: Date.now() + 5 * 60 * 1000,
    from: connection.account.address,
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
