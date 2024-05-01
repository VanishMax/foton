import { Address } from '@ton/core';

import { bocToHash } from '../shared/utils/index.js';

import type { CompiledContract, ContractMethod, ContractMethodNames } from './helper-types.js';
import type { ContractClient } from './types.js';
import { composePayload } from './abi/index.js';

export interface WriteContractOptions<CONTRACT extends CompiledContract, METHOD extends ContractMethodNames<CONTRACT>> {
  value: bigint;
  method: METHOD;
  payload: ContractMethod<CONTRACT, METHOD>;
}

export async function writeContract <CONTRACT extends CompiledContract, METHOD extends ContractMethodNames<CONTRACT>>(
  this: ContractClient<CONTRACT>,
  options: WriteContractOptions<CONTRACT, METHOD>,
): Promise<string> {
  if (!this.address) {
    throw new Error('The contract address is not provided');
  }

  if (!this._walletClient.connected || !this._walletClient.address) {
    throw new Error('Not authorized. Please, connect the wallet first');
  }

  const fullContract = this._contract.fromAddress(Address.parseFriendly(this.address).address);

  if (!fullContract.abi) {
    throw new Error('Incorrect contract. Please, provide the class of a contract compiled from your Tact or Func files');
  }

  // TODO: control the state of sending the transaction: throw error if rejected, etc.
  const res = await this._walletClient.connection.sendTransaction({
    validUntil: Date.now() + 5 * 60 * 1000,
    from: this.address,
    messages: [
      {
        address: this.address,
        amount: options.value.toString(),
        payload: composePayload(fullContract, options.method, options.payload),
      },
    ],
  });

  return bocToHash(res.boc);
}

