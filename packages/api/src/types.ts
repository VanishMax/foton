import createOpenapiClient from 'openapi-fetch';
import type { paths } from './schemas/toncenter-v3.js';

export type OpenapiClient = ReturnType<typeof createOpenapiClient<paths>>;

export type SupportedApiUrls = 'mainnet' | 'testnet';

export type ClientCustomApiOptions = { url: string };

export interface CreateClientOptions {
  api?: SupportedApiUrls | ClientCustomApiOptions;
  authToken?: string;
}
