import { ContractRunGetMethodResponse } from './types.ts';
import { hexToBigInt, isHex } from '../utils/viem-utils.ts';
import { TONCENTER_API_URL } from './constants.ts';

export const getCounter = async (address: string): Promise<undefined | bigint> => {
  const res = await fetch(`${TONCENTER_API_URL}/runGetMethod`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      address: address,
      method: 'counter',
      stack: []
    }),
  });

  const data: ContractRunGetMethodResponse = await res.json();
  if (data.exit_code !== 0) {
    return;
  }

  const counter = data.stack[0].value;
  if (!counter || !isHex(counter, { strict: true })) {
    return;
  }

  return hexToBigInt(counter);
};
