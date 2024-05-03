import { ABIType, Address, beginCell, Builder, Cell, Contract } from '@ton/core';
import type { ABITypeRef, ContractABI } from '@ton/core';

import type { AbiFieldType } from './abi-types.js';

type PayloadSchema = Record<string, ABITypeRef>;

const getAvailableMethods = (abi: ContractABI): string[] => {
  return (abi.receivers || []).reduce((accum, currentValue) => {
    if (currentValue.message.kind === 'typed') {
      accum.push(currentValue.message.type);
    }
    return accum;
  }, [] as string[]);
};

const getAbiType = (abi: ContractABI, method: string): ABIType | undefined => {
  return (abi.types || []).find((type) => type.name === method);
};

const getMethodSchema = (abi: ContractABI, abiType: ABIType): PayloadSchema => {
  return (abiType?.fields || [])
    .reduce((accum, currentValue) => {
      accum[currentValue.name] = currentValue.type;
      return accum;
    }, {} as Record<string, ABITypeRef>);
};

const getMethodHeader = (abi: ContractABI, method: string): number | undefined => {
  const abiType = (abi.types || []).find((type) => type.name === method);

  return abiType?.header || undefined;
};

const fieldTypeValidators: Record<AbiFieldType, (builder: Builder, value: unknown, format?: number) => Error | void> = {
  uint: (builder, value, format) => {
    if (!(typeof value === 'bigint' && value >= 0n)) {
      return new Error('Uint value must be a positive bigint');
    }

    builder.storeUint(value, format ?? 32);
  },
  int: (builder, value, format) => {
    if (!(typeof value === 'bigint')) {
      return new Error('Int value must be a bigint');
    }

    builder.storeInt(value, format ?? 32);
  },
  bool: (builder, value, format) => {
    if (!(typeof value === 'boolean')) {
      return new Error('Bool value must be a boolean');
    }

    builder.storeBit(value);
  },
  address: (builder, value, format) => {
    if (!(typeof value === 'string')) {
      return new Error('Address value must be a string');
    }

    const address = Address.parseFriendly(value).address;
    builder.storeAddress(address);
  },
  cell: (builder, value, format) => {
    if (!(typeof value === 'string')) {
      return new Error('Cell value must be a string');
    }

    // TODO: verify it works as expected
    const cell = Cell.fromBase64(value);
    builder.storeRef(cell);
  },
  slice: (builder, value, format) => {
    if (!(typeof value === 'string')) {
      return new Error('Cell value must be a string');
    }

    // TODO: verify it works as expected
    const slice = Cell.fromBase64(value).asSlice();
    builder.storeSlice(slice);
  },
}

const validateSchema = (schema: PayloadSchema, payload: Record<string, unknown>, header?: number): string => {
  const payloadBuilder = beginCell();

  if (header) {
    payloadBuilder.storeUint(header, 32);
  }

  Object.entries(schema).forEach(([key, field]) => {
    const value = payload[key];
    if (field.kind === 'simple') {
      const optional = field.optional || true;
      if (!optional && (typeof value === 'undefined' || value === null)) {
        throw new Error(`Field ${key} is required`);
      }

      const typedField = field.type as AbiFieldType;

      // TODO: format might not be a number – check when it can be a string and fix this
      const validated = fieldTypeValidators[typedField](payloadBuilder, value, field.format as number);
      if (validated instanceof Error) {
        throw new Error(`Payload validation failed for field "${key}": ${validated.message}`);
      }
    } else {
      // TODO: add support for kind:'dict' field type
      throw new Error('Unsupported field type');
    }
  });

  return payloadBuilder.endCell().toBoc().toString('base64');
};

// TODO: simplify the function to allow it for external use – without the contract instance or method
export const composePayload = (contract: Contract, method: 'empty' | string, payload?: Record<string, unknown>): string => {
  if (!contract.abi) {
    throw new Error('Contract class must have an ABI');
  }

  const availableMethods = getAvailableMethods(contract.abi);
  if (!availableMethods.includes(method)) {
    throw new Error(`Method ${method} is not available for this contract's ABI`);
  }

  if (method === 'empty') {
    return new Cell().toBoc().toString('base64');
  }

  const abiType = getAbiType(contract.abi, method);
  if (!abiType) {
    // if !abiType – the method should be sent as a string
    const cell = beginCell().storeUint(0, 32).storeStringTail(method).endCell();
    return cell.toBoc().toString('base64');
  }

  const schema = getMethodSchema(contract.abi, abiType);
  const header = getMethodHeader(contract.abi, method);

  // TODO: methods might also need to add `value` and `bounce` fields to the Builder
  return validateSchema(schema, payload || {}, header);
};
