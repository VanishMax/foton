import createOpenapiClient from 'openapi-fetch';

import type { paths } from './schemas/toncenter-v3.js';
import type { CreateClientOptions, SupportedApiUrls } from './types.js';
import { adaptClientRpc, type RpcClient } from './requests/index.js';

const CHAIN_API_MAP: Record<SupportedApiUrls, string> = {
  mainnet: 'https://toncenter.com',
  testnet: 'https://testnet.toncenter.com',
}

export const createClient = (options?: CreateClientOptions): RpcClient => {
  const { api = 'mainnet', authToken } = options || {};

  let baseUrl: string;
  if (typeof api === 'object') {
    baseUrl = api.url;
  } else {
    baseUrl = CHAIN_API_MAP[api];
  }

  const openapiClient = createOpenapiClient<paths>({ baseUrl });

  if (authToken) {
    openapiClient.use({
      onRequest: ({ request }) => {
        request.headers.set('X-API-Key', authToken);
        return request;
      },
    });
  }

  return adaptClientRpc(openapiClient);
};
