import { Cell, ContractABI } from '@ton/core';
import type { RunGetMethodResponse, GetMethodParameterOutput } from '@fotonjs/api';

type ContractReadReturn = number | string | ContractReadReturn[];

const simpleParse = (stack: GetMethodParameterOutput[]): ContractReadReturn | undefined => {
  if (stack.length > 1) {
    // TODO: it is currently unknown if Toncenter can return multiple values for `runGetMethod`. Needs R&D
    console.error('The response data is parsed incorrectly. Please submit an issue to "foton" repository with the request you are trying to make.');
  }

  const item = stack.filter((item) => !!item)?.[0];
  if (!item) {
    return undefined;
  }

  if (item.type === 'num' && typeof item.value === 'string') {
    return parseInt(item.value);
  }

  if (typeof item.value === 'string') {
    return item.value;
  }

  if (!item.value) {
    return undefined;
  }

  return simpleParse(item.value);
};

export const parseReadReturn = (
  abi: ContractABI,
  getter: string,
  result: RunGetMethodResponse,
): undefined | number | boolean | string | ContractReadReturn[] => {
  // TODO if Toncenter fails, they return an error 503 with `{ error: "" }` data. Add support for it
  // TODO if the request is limited, error 429 is returned with different structure. Add support for it
  // TODO add support for different exit_codes (currently only 0 is supported, other codes are considered as errors)
  if (result.exit_code !== 0) {
    throw new Error(`Getter ${getter} failed with exit code ${result.exit_code}`);
  }

  const parsed = simpleParse(result.stack);

  const abiReturn = abi.getters?.find((type) => type.name === getter)?.returnType;
  if (!abiReturn) {
    return parsed;
  }

  // TODO: add support for dict
  if (abiReturn.kind !== 'simple') {
    return simpleParse(result.stack);
  }

  if (abiReturn.type === 'int' && typeof parsed === 'number') {
    return parsed;
  }

  if (abiReturn.type === 'bool' && typeof parsed === 'number') {
    return parsed === 0;
  }

  if (abiReturn.type === 'address' && typeof parsed === 'string') {
    const cell = Cell.fromBase64(parsed).beginParse().loadAddress();
    return cell.toString();
  }

  if ((abiReturn.type === 'cell' || abiReturn.type === 'slice') && typeof parsed === 'string') {
    return parsed;
  }

  const abiType = (abi.types || []).find((type) => type.name === abiReturn.type);
  if (abiType && abiType.fields?.length && Array.isArray(parsed)) {
    // TODO: implement matching abi type (usually if the getter returns Struct) to the result
    return parsed;
  }

  return parsed;
};
