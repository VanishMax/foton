import createOpenapiClient from 'openapi-fetch';

import type { paths } from './schemas/toncenter-v3.js';
import type { Chain } from './types.js';
import { adaptClientRpc, type RpcClient } from './requests/index.js';

export interface CreateClientOptions {
  chain?: Chain;
}

// TODO: add support for custom RPC nodes
const CHAIN_API_MAP: Record<Chain, string> = {
  mainnet: 'https://toncenter.com',
  testnet: 'https://testnet.toncenter.com',
}

export const createClient = (options?: CreateClientOptions): RpcClient => {
  const { chain = 'mainnet' } = options || {};

  const baseUrl = CHAIN_API_MAP[chain];

  const openapiClient = createOpenapiClient<paths>({ baseUrl });

  return adaptClientRpc(openapiClient);
};
