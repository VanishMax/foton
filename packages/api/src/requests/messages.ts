import { operations } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

type MessagesOptions = operations['get_messages_api_v3_messages_get']['parameters']['query'];

export const messages = (client: OpenapiClient, options: MessagesOptions) => {
  return client.GET('/api/v3/messages', {
    params: {
      query: options,
    }
  });
};
