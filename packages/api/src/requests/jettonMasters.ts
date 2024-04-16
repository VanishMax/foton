import { components, operations } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

export type JettonMastersOptions = operations['get_jetton_masters_api_v3_jetton_masters_get']['parameters']['query'];
export type JettonMastersResponse = components['schemas']['JettonMasterList'];
export type JettonMaster = components['schemas']['JettonMaster'];

export const jettonMasters = (client: OpenapiClient, options: JettonMastersOptions) => {
  return client.GET('/api/v3/jetton/masters', {
    params: {
      query: options,
    }
  });
};
