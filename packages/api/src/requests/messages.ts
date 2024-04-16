import type { components, operations } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

export type MessagesOptions = operations['get_messages_api_v3_messages_get']['parameters']['query'];
export type MessagesResponse = components['schemas']['MessageList'];
export type Message = components['schemas']['Message'];

export const messages = (client: OpenapiClient, options: MessagesOptions) => {
  return client.GET('/api/v3/messages', {
    params: {
      query: options,
    }
  });
};
