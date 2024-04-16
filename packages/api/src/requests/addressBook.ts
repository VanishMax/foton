import { components, operations } from '../schemas/toncenter-v3.js';
import type { OpenapiClient } from '../types.js';

export type AddressBookOptions = operations['get_address_book_api_v3_addressBook_get']['parameters']['query'];
export type AddressBookEntry = components['schemas']['AddressBookEntry'];
export type AddressBookResponse = Record<string, components['schemas']['AddressBookEntry']>;

export const addressBook = (client: OpenapiClient, options: AddressBookOptions) => {
  return client.GET('/api/v3/addressBook', {
    params: {
      query: options,
    }
  });
};
