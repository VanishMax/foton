import type { OpenapiClient } from '../types.js';

export const masterchainInfo = (client: OpenapiClient) => {
  return client.GET('/api/v3/masterchainInfo');
};
