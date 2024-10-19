import { Address } from '@ton/core';

import { bocToHash } from '../shared/utils/index.js';

import type { CompiledContract, ContractMethod, ContractMethodNames } from './helper-types.js';
import type { ContractClient } from './types.js';
import { composePayload } from './abi/index.js';
import { getNetwork } from '../shared/chains.js';
import { DataOrTypedError, returnData, returnError } from '../shared/errors/index.js';

export interface WriteContractOptions<CONTRACT extends CompiledContract, METHOD extends ContractMethodNames<CONTRACT>> {
  value: bigint;
  method: METHOD;
  payload: ContractMethod<CONTRACT, METHOD>;
}

// TODO: fix the return type – somehow data.error returns `undefined | MissingContractAddressError | UserUnauthorizedError | IncorrectContractError`
type WriteContractReturn = DataOrTypedError<string, 'MissingContractAddressError' | 'UserUnauthorizedError' | 'IncorrectContractError' | 'UserRejectedTransactionError'>;

export async function writeContract <CONTRACT extends CompiledContract, METHOD extends ContractMethodNames<CONTRACT>>(
  this: ContractClient<CONTRACT>,
  options: WriteContractOptions<CONTRACT, METHOD>,
): Promise<WriteContractReturn> {
  if (!this.address) {
    return returnError('MissingContractAddressError');
  }

  if (!this._walletClient.connected || !this._walletClient.address) {
    return returnError('UserUnauthorizedError');
  }

  // TODO: control the state of sending the transaction: throw error if rejected, etc.
  try {
    const fullContract = this._contract.fromAddress(Address.parse(this.address));

    if (!fullContract.abi) {
      return returnError('IncorrectContractError');
    }

    const res = await this._walletClient.connection.sendTransaction({
      network: getNetwork(this._walletClient._chain),
      validUntil: Date.now() + 5 * 60 * 1000,
      from: this._walletClient.address,
      messages: [
        {
          address: this.address,
          amount: options.value.toString(),
          payload: composePayload(fullContract, options.method, options.payload),
        },
      ],
    });

    return returnData(bocToHash(res.boc));
  } catch (error) {
    // TODO: add more error handlers for different scenarios
    return returnError('UserRejectedTransactionError');
  }
}

