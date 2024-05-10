import type { WalletClientBase } from './types.js';
import { bocToHash } from '../shared/utils/index.js';
import { getNetwork } from '../shared/chains.js';
import { returnError, returnData, type DataOrTypedError } from '../shared/errors/index.js';

export interface SendTransactionOptions {
  to: string;
  value: bigint;
}

export async function sendTransaction (
  this: WalletClientBase,
  options: SendTransactionOptions,
): Promise<DataOrTypedError<string, 'UserUnauthorizedError' | 'UserRejectedTransactionError'>> {
  if (!this.connected || !this.address) {
    return returnError('UserUnauthorizedError');
  }

  try {
    const res = await this.connection.sendTransaction({
      network: getNetwork(this._chain),
      from: this.address,
      validUntil: Date.now() + 5 * 60 * 1000,
      messages: [
        {
          address: options.to,
          amount: options.value.toString(),
        }
      ],
    });

    const hash = bocToHash(res.boc);
    return returnData(hash);
  }  catch (error) {
    return returnError('UserRejectedTransactionError');
  }
}
