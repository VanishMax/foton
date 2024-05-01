import { Contract, beginCell, storeStateInit } from '@ton/core';

import type { WalletClientBase } from './types.js';
import { bocToHash } from '../shared/utils/index.js';
import { composePayload } from '../shared/abi/index.js';
import type { CompiledContract, ContractMethod } from '../shared/abi/index.js';

const getStateInit = (contract: Contract): string => {
  const stateInitBuilder = beginCell();
  storeStateInit({ code: contract.init!.code, data: contract.init!.data })(stateInitBuilder);
  const stateInit = stateInitBuilder.endCell();

  return stateInit.toBoc().toString("base64");
};

export interface DeployContractOptions<CONTRACT extends CompiledContract> {
  contract: CONTRACT;
  value: bigint;
  payload: ContractMethod<CONTRACT, 'Deploy'>;
}

export async function deployContract <CONTRACT extends CompiledContract>(
  this: WalletClientBase,
  options: DeployContractOptions<CONTRACT>,
): Promise<string> {
  if (!this.connected || !this.address) {
    throw new Error('Not authorized. Please, connect the wallet first');
  }

  const fullContract = await options.contract.fromInit();

  if (!fullContract.init?.code || !fullContract.init?.data || !fullContract.abi) {
    throw new Error('Incorrect contract. Please, compile your Tact or Func contract provide the generated class as the `contract` option to this function');
  }

  const contractAddress = fullContract.address.toString() as string;

  // TODO: control the state of sending the transaction: throw error if rejected, etc.
  const res = await this.connection.sendTransaction({
    from: this.address,
    validUntil: Date.now() + 5 * 60 * 1000,
    messages: [
      {
        address: contractAddress,
        amount: options.value.toString(),
        stateInit: getStateInit(fullContract),
        payload: composePayload(fullContract, 'Deploy', options.payload),
      }
    ],
  });

  return bocToHash(res.boc);
}
