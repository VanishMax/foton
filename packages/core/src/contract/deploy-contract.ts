import { bocToHash } from '../shared/utils/index.js';

import { getNetwork } from '../shared/chains.js';
import { DataOrTypedError, returnData, returnError } from '../shared/errors/index.js';

import type { CompiledContract, ContractDeployArguments, ContractMethod } from './helper-types.js';
import type { ContractClient } from './types.js';
import { composePayload } from './abi/index.js';
import { getStateInit } from './utils/get-state-init.js';

export interface DeployContractOptions<CONTRACT extends CompiledContract> {
  value: bigint;
  arguments: ContractDeployArguments<CONTRACT>;
  payload: ContractMethod<CONTRACT, 'Deploy'>;
}

export interface DeployContractData {
  address: string;
  txHash: string;
}

type DeployContractReturn = DataOrTypedError<DeployContractData, 'UserUnauthorizedError' | 'IncorrectContractError' | 'UserRejectedTransactionError'>;

export async function deployContract <CONTRACT extends CompiledContract>(
  this: ContractClient<CONTRACT>,
  options: DeployContractOptions<CONTRACT>,
): Promise<DeployContractReturn> {
  if (!this._walletClient.connected || !this._walletClient.address) {
    return returnError('UserUnauthorizedError');
  }

  const fullContract = await this._contract.fromInit(...options.arguments);

  if (!fullContract.init?.code || !fullContract.init?.data || !fullContract.abi) {
    return returnError('IncorrectContractError');
  }

  const contractAddress = fullContract.address.toString();

  try {
    const res = await this._walletClient.connection.sendTransaction({
      network: getNetwork(this._walletClient._chain),
      from: this._walletClient.address,
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

    this.setAddress(contractAddress);
    return returnData({
      address: contractAddress,
      txHash: bocToHash(res.boc),
    });
  } catch (error) {
    // TODO: add more error handlers for different scenarios
    return returnError('UserRejectedTransactionError');
  }
}
