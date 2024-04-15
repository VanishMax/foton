import { operations } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

type BlocksOptions = operations['get_blocks_api_v3_blocks_get']['parameters']['query'];

export const blocks = (client: OpenapiClient, options: BlocksOptions) => {
  return client.GET('/api/v3/blocks', {
    params: {
      query: options,
    }
  });
};
