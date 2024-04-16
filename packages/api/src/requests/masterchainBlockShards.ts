import { components, operations } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

export type MasterchainBlockShardsOptions = operations['get_masterchain_block_shards_api_v3_masterchainBlockShards_get']['parameters']['query'];
export type MasterchainBlockShardsResponse = components['schemas']['BlockList'];

export const masterchainBlockShards = (client: OpenapiClient, options: MasterchainBlockShardsOptions) => {
  return client.GET('/api/v3/masterchainBlockShards', {
    params: {
      query: options,
    }
  });
};
