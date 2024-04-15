import type { paths } from './schemas/toncenter-v3.js';
import createOpenapiClient from 'openapi-fetch';

export type Chain = 'mainnet' | 'testnet';
export interface CreateClientOptions {
  chain?: Chain;
}

// TODO: add support for custom RPC nodes
const CHAIN_API_MAP: Record<Chain, string> = {
  mainnet: 'https://toncenter.com',
  testnet: 'https://testnet.toncenter.com',
}

export type OpenapiClient = ReturnType<typeof createOpenapiClient<paths>>;

export const createClient = (options?: CreateClientOptions): OpenapiClient => {
  const { chain = 'mainnet' } = options || {};

  const baseUrl = CHAIN_API_MAP[chain];

  return createOpenapiClient<paths>({ baseUrl });
};
