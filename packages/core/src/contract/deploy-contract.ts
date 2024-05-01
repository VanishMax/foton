import { bocToHash } from '../shared/utils/index.js';

import type { CompiledContract, ContractDeployArguments, ContractMethod } from './helper-types.js';
import type { ContractClient } from './types.js';
import { composePayload } from './abi/index.js';
import { getStateInit } from './utils/get-state-init.js';

export interface DeployContractOptions<CONTRACT extends CompiledContract> {
  value: bigint;
  arguments: ContractDeployArguments<CONTRACT>;
  payload: ContractMethod<CONTRACT, 'Deploy'>;
}

export interface DeployContractReturn {
  address: string;
  txHash: string;
}

export async function deployContract <CONTRACT extends CompiledContract>(
  this: ContractClient<CONTRACT>,
  options: DeployContractOptions<CONTRACT>,
): Promise<DeployContractReturn> {
  if (!this._walletClient.connected || !this._walletClient.address) {
    throw new Error('Not authorized. Please, connect the wallet first');
  }

  const fullContract = await this._contract.fromInit(...options.arguments);

  if (!fullContract.init?.code || !fullContract.init?.data || !fullContract.abi) {
    throw new Error('Incorrect contract. Please, provide the contract class compiled from your Tact or Func contract');
  }

  const contractAddress = fullContract.address.toString();

  // TODO: control the state of sending the transaction: throw error if rejected, etc.
  const res = await this._walletClient.connection.sendTransaction({
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
  return {
    address: contractAddress,
    txHash: bocToHash(res.boc),
  };
}
