import { beginCell, storeStateInit } from '@ton/core';

import type { ExtendedContract } from '../helper-types.js';

export const getStateInit = (contract: ExtendedContract): string => {
  const stateInitBuilder = beginCell();
  storeStateInit({ code: contract.init!.code, data: contract.init!.data })(stateInitBuilder);
  const stateInit = stateInitBuilder.endCell();

  return stateInit.toBoc().toString("base64");
};
