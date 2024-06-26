import type { components, operations } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

export type BlocksOptions = operations['get_blocks_api_v3_blocks_get']['parameters']['query'];
export type BlocksResponse = components['schemas']['BlockList'];
export type Block = components['schemas']['Block'];

export const blocks = (client: OpenapiClient, options: BlocksOptions) => {
  return client.GET('/api/v3/blocks', {
    params: {
      query: options,
    }
  });
};
