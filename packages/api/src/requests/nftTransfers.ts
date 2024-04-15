import { operations } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

type NftTransfersOptions = operations['get_nft_transfers_api_v3_nft_transfers_get']['parameters']['query'];

export const nftTransfers = (client: OpenapiClient, options: NftTransfersOptions) => {
  return client.GET('/api/v3/nft/transfers', {
    params: {
      query: options,
    }
  });
};
