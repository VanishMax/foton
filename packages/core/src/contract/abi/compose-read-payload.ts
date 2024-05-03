import type { GetMethodParameterInput } from '@fotonjs/api';
import type { ContractABI } from '@ton/core';

export const composeReadPayload = (
  abi: ContractABI,
  getter: string,
  args: unknown[]
): GetMethodParameterInput[] => {
  const getterAbi = (abi.getters || []).find((type) => type.name === getter);

  if (!getterAbi) {
    throw new Error(`Getter ${getter} is not found in the contract's ABI`);
  }

  const argumentFields = getterAbi.arguments || [];
  if (args.length > argumentFields.length) {
    throw new Error(`The number of arguments provided to the "${getter}" getter is more than the number of arguments in the ABI. Expected no more than ${argumentFields.length}, got ${args.length}`);
  }

  return argumentFields.map((field, index) => {
    const value = args[index];

    if (field.type.kind === 'simple') {
      if (field.type.type === 'int') {
        if (typeof value !== 'bigint') {
          throw new Error(`"${getter}" getter: Argument "${field.name}" must be a bigint`);
        }
        return {
          type: 'num',
          value: `0x${value.toString(16)}`,
        };
      }

      if (typeof value !== 'string') {
        throw new Error(`"${getter}" getter: Argument "${field.name}" must be a string`);
      }
      // TODO: add support for struct types as arguments

      return {
        type: 'cell',
        value: value,
      }
    }

    // TODO: add support for dicts
    return {
      type: 'slice',
      value: value as string,
    };
  });
};
