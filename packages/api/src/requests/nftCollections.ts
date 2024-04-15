import { operations } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

type NftCollectionsOptions = operations['get_nft_collections_api_v3_nft_collections_get']['parameters']['query'];

export const nftCollections = (client: OpenapiClient, options: NftCollectionsOptions) => {
  return client.GET('/api/v3/nft/collections', {
    params: {
      query: options,
    }
  });
};
