import { Address } from '@ton/core';

import { composeReadPayload } from './abi/compose-read-payload.js';
import { parseReadReturn } from './abi/parse-read-return.js';
import type { CompiledContract, ContractGetterNames, ContractGetterReturn, ContractGetters } from './helper-types.js';
import type { ContractClient } from './types.js';

export interface ReadContractOptions<CONTRACT extends CompiledContract, GETTER extends ContractGetterNames<CONTRACT>> {
  getter: GETTER;
  arguments: ContractGetters<CONTRACT>[GETTER];
}

export async function readContract<CONTRACT extends CompiledContract, GETTER extends ContractGetterNames<CONTRACT>> (
  this: ContractClient<CONTRACT>,
  options: ReadContractOptions<CONTRACT, GETTER>,
): Promise<ContractGetterReturn<CONTRACT, GETTER> | undefined> {
  if (!this.address) {
    throw new Error('The contract address is not provided');
  }

  const fullContract = this._contract.fromAddress(Address.parseFriendly(this.address).address);

  if (!fullContract.abi) {
    throw new Error('Incorrect contract. Please, provide the class of a contract compiled from your Tact or Func files');
  }

  const args = composeReadPayload(fullContract.abi, options.getter, options.arguments);

  const res = await this._publicClient._api.runGetMethod({
    address: this.address,
    method: options.getter,
    // TODO: connect the inputs with the contract ABI
    // TODO: add better support for slice and cell types
    stack: args,
  });

  // TODO: handle the error correctly
  if (res.error) {
    return undefined;
  }

  try {
    return parseReadReturn(fullContract.abi, options.getter, res.data) as ContractGetterReturn<CONTRACT, GETTER>;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
