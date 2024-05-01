import { Cell } from '@ton/core';

export const bocToHash = (boc: string): string => {
  return Cell.fromBase64(boc).hash().toString('base64');
};
