import { components } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

type EstimateFeeOptions = components['schemas']['EstimateFeeRequest'];

export const estimateFee = (client: OpenapiClient, options: EstimateFeeOptions) => {
  return client.POST('/api/v3/estimateFee', {
    body: options,
  });
};
