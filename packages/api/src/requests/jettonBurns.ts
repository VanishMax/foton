import { operations } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

type JettonBurnsOptions = operations['get_jetton_burns_api_v3_jetton_burns_get']['parameters']['query'];

export const jettonBurns = (client: OpenapiClient, options: JettonBurnsOptions) => {
  return client.GET('/api/v3/jetton/burns', {
    params: {
      query: options,
    }
  });
};
