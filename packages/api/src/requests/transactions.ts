import { operations } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

type TransactionsOptions = operations['get_transactions_api_v3_transactions_get']['parameters']['query'];

export const transactions = (client: OpenapiClient, options: TransactionsOptions) => {
  return client.GET('/api/v3/transactions', {
    params: {
      query: options,
    }
  });
};
