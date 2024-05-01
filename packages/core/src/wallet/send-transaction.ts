import type { WalletClientBase } from './types.js';
import { bocToHash } from '../shared/utils/index.js';

export interface SendTransactionOptions {
  to: string;
  value: bigint;
}

export async function sendTransaction (this: WalletClientBase, options: SendTransactionOptions): Promise<string> {
  if (!this.connected || !this.address) {
    throw new Error('Not authorized. Please, connect the wallet first');
  }

  const res = await this.connection.sendTransaction({
    from: this.address,
    validUntil: Date.now() + 5 * 60 * 1000,
    messages: [
      {
        address: options.to,
        amount: options.value.toString(),
      }
    ],
  });

  return bocToHash(res.boc);
}
