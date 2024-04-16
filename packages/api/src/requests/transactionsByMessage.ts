import { components, operations } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

export type TransactionsByMessageOptions = operations['get_transactions_by_message_api_v3_transactionsByMessage_get']['parameters']['query'];
export type TransactionsByMessageResponse = components['schemas']['TransactionList'];

export const transactionsByMessage = (client: OpenapiClient, options: TransactionsByMessageOptions) => {
  return client.GET('/api/v3/transactionsByMessage', {
    params: {
      query: options,
    }
  });
};
