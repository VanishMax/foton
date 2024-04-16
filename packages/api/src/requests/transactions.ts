import { components, operations } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

export type TransactionsOptions = operations['get_transactions_api_v3_transactions_get']['parameters']['query'];
export type TransactionsResponse = components['schemas']['TransactionList'];
export type Transaction = components['schemas']['Transaction'];

export const transactions = (client: OpenapiClient, options: TransactionsOptions) => {
  return client.GET('/api/v3/transactions', {
    params: {
      query: options,
    }
  });
};
