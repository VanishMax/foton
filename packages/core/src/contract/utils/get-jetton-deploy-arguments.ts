import { Address, Cell } from '@ton/core';
import { buildJettonOnchainMetadata } from './build-jetton-metadata.js';

export interface JettonMetadata {
  name: string;
  description: string;
  symbol: string;
  image: string;
  imageData: string;
  uri: string;
  // TODO: add support for number type in dictionary
  // decimals: number;
  amount_style: 'n' | 'n-of-total' | '%';
  render_type: 'currency' | 'game';
}

export interface GetJettonDeployArgumentsOptions {
  owner: string;
  content: Partial<JettonMetadata>,
  maxSupply: bigint;
}

export type GetJettonDeployArgumentsReturn = [owner: Address, content: Cell, max_supply: bigint];

export const getJettonDeployArguments = (options: GetJettonDeployArgumentsOptions): GetJettonDeployArgumentsReturn => {
  const owner = Address.parse(options.owner);
  const metatada = buildJettonOnchainMetadata(options.content);
  const supply = BigInt(options.maxSupply);

  return [owner, metatada, supply];
};
