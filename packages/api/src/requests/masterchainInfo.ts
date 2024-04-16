import type { components } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

export type MasterchainInfoResponse = components['schemas']['MasterchainInfo'];

export const masterchainInfo = (client: OpenapiClient) => {
  return client.GET('/api/v3/masterchainInfo');
};
