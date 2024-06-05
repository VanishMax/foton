import { ABITypeRef, Cell, ContractABI } from '@ton/core';
import type { GetMethodParameterOutput, RunGetMethodResponse } from '@fotonjs/api';

type ContractReadReturn = bigint | string;
type ParsedReadReturn = undefined | bigint | boolean | string;

const simpleParse = (item: GetMethodParameterOutput): ContractReadReturn | undefined => {
  if (item.type === 'num' && typeof item.value === 'string') {
    if (item.value.startsWith('-')) {
      return -1n * BigInt(item.value.slice(1));
    }
    return BigInt(item.value);
  }

  if (typeof item.value === 'string') {
    return item.value;
  }

  if (!item.value) {
    return undefined;
  }

  if (Array.isArray(item.value)) {
    throw new Error('The response data is parsed incorrectly: nested array data is not yet supported. Please submit an issue to "foton" repository with the request you are trying to make.');
  }

  return undefined;
};

const parseAbiRef = (abiRef: ABITypeRef, value: GetMethodParameterOutput): ParsedReadReturn => {
  const parsed = simpleParse(value);

  // TODO: add support for dict
  if (abiRef.kind !== 'simple') {
    // TODO: Allow parsing dicts from Toncenter. Needs R&D
    console.error('The response data is parsed incorrectly. Please submit an issue to "foton" repository with the request you are trying to make.');
    return undefined;
  }

  if (abiRef.type === 'int' && typeof parsed === 'bigint') {
    return parsed;
  }

  if (abiRef.type === 'bool' && typeof parsed === 'bigint') {
    return parsed !== 0n;
  }

  if (abiRef.type === 'address' && typeof parsed === 'string') {
    const cell = Cell.fromBase64(parsed).beginParse().loadAddress();
    return cell.toString();
  }

  if ((abiRef.type === 'cell' || abiRef.type === 'slice') && typeof parsed === 'string') {
    return parsed;
  }

  return undefined;
};

export const parseReadReturn = (
  abi: ContractABI,
  getter: string,
  result: RunGetMethodResponse,
): ParsedReadReturn | Record<string, ParsedReadReturn> => {
  // TODO if Toncenter fails, they return an error 503 with `{ error: "" }` data. Add support for it
  // TODO if the request is limited, error 429 is returned with different structure. Add support for it
  // TODO add support for different exit_codes (currently only 0 is supported, other codes are considered as errors)
  if (result.exit_code !== 0) {
    throw new Error(`Getter ${getter} failed with exit code ${result.exit_code}`);
  }

  const abiReturn = abi.getters?.find((type) => type.name === getter)?.returnType;
  if (!abiReturn) {
    throw new Error(`Provided contract doesn't support a "${getter}" getter in its ABI`);
  }

  if (!result.stack.length) {
    return undefined;
  }

  if (abiReturn.kind !== 'simple') {
    // TODO: Allow parsing dicts from Toncenter. Needs R&D
    console.error('The response data is parsed incorrectly. Please submit an issue to "foton" repository with the request you are trying to make.');
    return simpleParse(result.stack[0]!);
  }

  // If the getter returns a struct, take the ABI of the struct and match its fields with result.stack
  const abiType = (abi.types || []).find((type) => type.name === abiReturn.type);
  if (abiType && abiType.fields?.length) {
    const structFields = abiType.fields;

    return result.stack.reduce((accum, currentValue, index) => {
      const matchingAbiField = structFields[index];
      if (!matchingAbiField) {
        return accum;
      }

      accum[matchingAbiField.name] = parseAbiRef(matchingAbiField.type, currentValue);

      return accum;
    }, {} as Record<string, ParsedReadReturn>);
  }

  // If the result is of simple type (num, bool, address), return it simply-parsed
  return parseAbiRef(abiReturn, result.stack[0]!);
};
