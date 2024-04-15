import { components } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

type RunGetMethodOptions = components['schemas']['RunGetMethodRequest'];

export const runGetMethod = (client: OpenapiClient, options: RunGetMethodOptions) => {
  return client.POST('/api/v3/runGetMethod', {
    body: options,
  });
};
