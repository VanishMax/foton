import { components, operations } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

export type JettonWalletsOptions = operations['get_jetton_wallets_api_v3_jetton_wallets_get']['parameters']['query'];
export type JettonWalletsResponse = components['schemas']['JettonWalletList'];
export type JettonWallet = components['schemas']['JettonWallet'];

export const jettonWallets = (client: OpenapiClient, options: JettonWalletsOptions) => {
  return client.GET('/api/v3/jetton/wallets', {
    params: {
      query: options,
    }
  });
};
