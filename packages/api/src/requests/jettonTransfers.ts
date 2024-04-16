import { components, operations } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

export type JettonTransfersOptions = operations['get_jetton_transfers_api_v3_jetton_transfers_get']['parameters']['query'];
export type JettonTransfersResponse = components['schemas']['JettonTransferList'];
export type JettonTransfer = components['schemas']['JettonTransfer'];

export const jettonTransfers = (client: OpenapiClient, options: JettonTransfersOptions) => {
  return client.GET('/api/v3/jetton/transfers', {
    params: {
      query: options,
    }
  });
};
