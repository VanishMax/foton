import type { GetMethodParameterInput } from '@foton/api';

import type { ContractClient } from './types.js';
import type { CompiledContract, ContractGetterNames, ContractGetters, ContractGetterReturn } from './helper-types.js';
import { Address } from '@ton/core';

export interface ReadContractOptions<CONTRACT extends CompiledContract, GETTER extends ContractGetterNames<CONTRACT>> {
  getter: GETTER;
  arguments: ContractGetters<CONTRACT>[GETTER];
}

const transformArguments = <CONTRACT extends CompiledContract, GETTER extends ContractGetterNames<CONTRACT>> (
  args: ContractGetters<CONTRACT>[GETTER],
): GetMethodParameterInput[] => {
  return args.map((arg) => {
    if (typeof arg === 'number' || typeof arg === 'bigint') {
      return {
        type: 'num',
        value: `0x${arg.toString(16)}`,
      };
    }

    return {
      type: 'cell',
      value: arg,
    };
  });
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

  const res = await this._publicClient._api.runGetMethod({
    address: this.address,
    method: options.getter,
    // TODO: connect the inputs with the contract ABI
    // TODO: add better support for slice and cell types
    stack: transformArguments(options.arguments),
  });

  // TODO: handle the error correctly
  if (res.error) {
    return undefined;
  }

  // TODO: parse the output correctly, add support for different data types
  // TODO: in case of an error with res.data.exit_code, throw a correct error (or move it to @foton/api)
  const output = res.data?.stack?.[0]?.value;
  return output
    ? parseInt(output as string, 16) as ContractGetterReturn<CONTRACT, GETTER>
    : undefined;
}
