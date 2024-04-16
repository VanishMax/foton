import { components, operations } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

export type MasterchainBlockShardStateOptions = operations['get_shards_by_masterchain_block_api_v3_masterchainBlockShardState_get']['parameters']['query'];
export type MasterchainBlockShardsStateResponse = components['schemas']['BlockList'];

export const masterchainBlockShardState = (client: OpenapiClient, options: MasterchainBlockShardStateOptions) => {
  return client.GET('/api/v3/masterchainBlockShardState', {
    params: {
      query: options,
    }
  });
};
