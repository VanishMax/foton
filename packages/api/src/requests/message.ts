import { components } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

export type MessageOptions = components['schemas']['ExternalMessage'];
export type MessageResponse = components['schemas']['SentMessage'];

export const message = (client: OpenapiClient, options: MessageOptions) => {
  return client.POST('/api/v3/message', {
    body: options,
  });
};
