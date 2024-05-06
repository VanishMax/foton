import { PublicClient } from './types.js';

export interface GetBalanceOptions {
  address: string;
}

export async function getBalance (this: PublicClient, options: GetBalanceOptions): Promise<bigint | undefined> {
  const result = await this._api.account({ address: options.address });
  return result.data?.balance ? BigInt(result.data.balance) : undefined;
}
