import type { components, operations } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

export type NftItemsOptions = operations['get_nft_items_api_v3_nft_items_get']['parameters']['query'];
export type NftItemsResponse = components['schemas']['NFTItemList'];
export type NftItem = components['schemas']['NFTItem'];

export const nftItems = (client: OpenapiClient, options: NftItemsOptions) => {
  return client.GET('/api/v3/nft/items', {
    params: {
      query: options,
    }
  });
};
