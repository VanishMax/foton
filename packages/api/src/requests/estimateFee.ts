import type { components } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

export type EstimateFeeOptions = components['schemas']['EstimateFeeRequest'];
export type EstimateFeeResponse = components['schemas']['EstimateFeeResponse'];

export const estimateFee = (client: OpenapiClient, options: EstimateFeeOptions) => {
  return client.POST('/api/v3/estimateFee', {
    body: options,
  });
};
