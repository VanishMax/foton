import { beginCell, Cell, Dictionary } from '@ton/core';
import { sha256_sync } from '@ton/crypto'

const textToSha256 = (str: string): bigint => {
  return BigInt('0x' + sha256_sync(str).toString('hex'))
}

const textToCell = (value: string): Cell => {
  return beginCell().storeUint(0, 8).storeStringTail(value).endCell()
}

const numberToCell = (value: bigint): Cell => {
  return beginCell().storeUint(value, 64).endCell()
}

export const composeDict = (info: Record<string, string | bigint>): Dictionary<bigint, Cell> => {
  const dictionary = Dictionary.empty<bigint, Cell>(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());

  Object.entries(info).forEach(([key, value]) => {
    if (typeof value === 'bigint') {
      dictionary.set(textToSha256(key), numberToCell(value));
      return;
    }
    dictionary.set(textToSha256(key), textToCell(value));
  });

  return dictionary;
};
