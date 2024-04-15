import { operations } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

type MasterchainBlockShardsOptions = operations['get_masterchain_block_shards_api_v3_masterchainBlockShards_get']['parameters']['query'];

export const masterchainBlockShards = (client: OpenapiClient, options: MasterchainBlockShardsOptions) => {
  return client.GET('/api/v3/masterchainBlockShards', {
    params: {
      query: options,
    }
  });
};
