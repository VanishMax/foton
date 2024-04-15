import { operations } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

type JettonWalletsOptions = operations['get_jetton_wallets_api_v3_jetton_wallets_get']['parameters']['query'];

export const jettonWallets = (client: OpenapiClient, options: JettonWalletsOptions) => {
  return client.GET('/api/v3/jetton/wallets', {
    params: {
      query: options,
    }
  });
};
