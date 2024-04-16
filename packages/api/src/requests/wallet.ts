import type { components, operations } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

export type WalletOptions = operations['get_wallet_information_api_v3_wallet_get']['parameters']['query'];
export type WalletResponse = components['schemas']['WalletInfo'];

export const wallet = (client: OpenapiClient, options: WalletOptions) => {
  return client.GET('/api/v3/wallet', {
    params: {
      query: options,
    }
  });
};
