import { Address } from '@ton/core';

import { type DataOrTypedError, returnData, returnError } from '../shared/errors/index.js';

import { composeReadPayload } from './abi/compose-read-payload.js';
import { parseReadReturn } from './abi/parse-read-return.js';
import type { CamelCase, CompiledContract, ContractGetterNames, ContractGetterReturn, ContractGetters } from './helper-types.js';
import type { ContractClient } from './types.js';

export interface ReadContractOptions<CONTRACT extends CompiledContract, GETTER extends ContractGetterNames<CONTRACT>> {
  getter: GETTER;
  arguments: ContractGetters<CONTRACT>[CamelCase<GETTER>];
}

type ReadContractReturn<CONTRACT extends CompiledContract, GETTER extends ContractGetterNames<CONTRACT>> =
  DataOrTypedError<ContractGetterReturn<CONTRACT, GETTER> | undefined, 'MissingContractAddressError' | 'IncorrectContractError' | 'TonReadError' | 'TonRateLimitError'>;

export async function readContract<CONTRACT extends CompiledContract, GETTER extends ContractGetterNames<CONTRACT>> (
  this: ContractClient<CONTRACT>,
  options: ReadContractOptions<CONTRACT, GETTER>,
): Promise<ReadContractReturn<CONTRACT, GETTER>> {
  if (!this.address) {
    return returnError('MissingContractAddressError');
  }

  const fullContract = this._contract.fromAddress(Address.parseFriendly(this.address).address);

  if (!fullContract.abi) {
    return returnError('IncorrectContractError');
  }

  const args = composeReadPayload(fullContract.abi, options.getter, options.arguments);

  const res = await this._publicClient._api.runGetMethod({
    address: this.address,
    method: options.getter,
    // TODO: add better support for slice and cell types
    stack: args,
  });

  // TODO: handle the read with more details
  if (res.error) {
    if (res.response.status === 429) {
      return returnError('TonRateLimitError');
    }
    return returnError('TonReadError');
  }

  try {
    return returnData(
      parseReadReturn(fullContract.abi, options.getter, res.data) as ContractGetterReturn<CONTRACT, GETTER>
    );
  } catch (error) {
    return returnError('TonReadError');
  }
}
