import type { components, operations } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

export type NftTransfersOptions = operations['get_nft_transfers_api_v3_nft_transfers_get']['parameters']['query'];
export type NftTransfersResponse = components['schemas']['NFTTransferList'];
export type NftTransfer = components['schemas']['NFTTransfer'];

export const nftTransfers = (client: OpenapiClient, options: NftTransfersOptions) => {
  return client.GET('/api/v3/nft/transfers', {
    params: {
      query: options,
    }
  });
};
