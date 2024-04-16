import { components } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

export type RunGetMethodOptions = components['schemas']['RunGetMethodRequest'];
export type RunGetMethodResponse = components['schemas']['RunGetMethodResponse'];
export type GetMethodParameterOutput = components['schemas']['GetMethodParameter-Output'];
export type GetMethodParameterInput = components['schemas']['GetMethodParameter-Input'];

export const runGetMethod = (client: OpenapiClient, options: RunGetMethodOptions) => {
  return client.POST('/api/v3/runGetMethod', {
    body: options,
  });
};
