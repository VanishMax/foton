import { operations } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

type TransactionsByMasterchainBlockOptions = operations['get_transactions_by_masterchain_block_api_v3_transactionsByMasterchainBlock_get']['parameters']['query'];

export const transactionsByMasterchainBlock = (client: OpenapiClient, options: TransactionsByMasterchainBlockOptions) => {
  return client.GET('/api/v3/transactionsByMasterchainBlock', {
    params: {
      query: options,
    }
  });
};
