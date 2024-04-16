import { hexToBigInt, isHex } from '../utils/viem-utils.ts';
import { publicClient } from './publicClient.ts';

export const getCounter = async (address: string): Promise<undefined | bigint> => {
  const res = await publicClient.runGetMethod({
    address,
    method: 'counter',
    stack: []
  });

  if (!res.data || res.data.exit_code !== 0) {
    return undefined;
  }

  const counter = res.data.stack[0].value;
  if (!counter || !isHex(counter, { strict: true })) {
    return undefined;
  }

  return hexToBigInt(counter);
};
