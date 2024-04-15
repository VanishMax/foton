import { operations } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

type AccountOptions = operations['get_account_information_api_v3_account_get']['parameters']['query'];

export const account = (client: OpenapiClient, options: AccountOptions) => {
  return client.GET('/api/v3/account', {
    params: {
      query: options,
    }
  });
};
