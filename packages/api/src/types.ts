import createOpenapiClient from 'openapi-fetch';
import type { paths } from './schemas/toncenter-v3.js';

export type OpenapiClient = ReturnType<typeof createOpenapiClient<paths>>;

export type Chain = 'mainnet' | 'testnet';
