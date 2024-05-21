import { beginCell, Cell } from '@ton/core';
import { composeDict } from './compose-dict.js';

const ONCHAIN_CONTENT_PREFIX = 0x00;
const OFFCHAIN_CONTENT_PREFIX = 0x01;
// const SNAKE_PREFIX = 0x00;

/** Adapted from Jetton minter project: https://github.com/ton-blockchain/minter/blob/main/src/lib/jetton-minter.ts */
export const buildJettonOffChainMetadata = (contentUri: string): Cell => {
  return beginCell()
    .storeInt(OFFCHAIN_CONTENT_PREFIX, 8)
    .storeBuffer(Buffer.from(contentUri, "ascii"))
    .endCell();
};

export type JettonMetaDataKeys = "name" | "description" | "image" | "symbol";

// const jettonOnChainMetadataSpec: {
//   [key in JettonMetaDataKeys]: "utf8" | "ascii" | undefined;
// } = {
//   name: "utf8",
//   description: "utf8",
//   image: "ascii",
//   symbol: "utf8",
// };

export const buildJettonOnchainMetadata = (data: Record<string, string>): Cell => {
  const dict = composeDict(data);

  const cell = beginCell().storeInt(ONCHAIN_CONTENT_PREFIX, 8).storeDict(dict).endCell();

  return cell;
}
