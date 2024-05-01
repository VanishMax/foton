import type { OpenapiClient } from '../types.js';
import { account } from './account.js';
import { addressBook } from './addressBook.js';
import { adjacentTransactions } from './adjacentTransactions.js';
import { blocks } from './blocks.js';
import { estimateFee } from './estimateFee.js';
import { jettonBurns } from './jettonBurns.js';
import { jettonMasters } from './jettonMasters.js';
import { jettonTransfers } from './jettonTransfers.js';
import { jettonWallets } from './jettonWallets.js';
import { masterchainBlockShards } from './masterchainBlockShards.js';
import { masterchainBlockShardState } from './masterchainBlockShardState.js';
import { masterchainInfo } from './masterchainInfo.js';
import { message } from './message.js';
import { messages } from './messages.js';
import { nftCollections } from './nftCollections.js';
import { nftItems } from './nftItems.js';
import { nftTransfers } from './nftTransfers.js';
import { runGetMethod } from './runGetMethod.js';
import { transactions } from './transactions.js';
import { transactionsByMasterchainBlock } from './transactionsByMasterchainBlock.js';
import { transactionsByMessage } from './transactionsByMessage.js';
import { wallet } from './wallet.js';

export const adaptClientRpc = (client: OpenapiClient) => {
  // TODO: create a wrapper for each function, as a middleware to handle many request for free/authorized/paid versions
  return {
    account: account.bind(null, client),
    addressBook: addressBook.bind(null, client),
    adjacentTransactions: adjacentTransactions.bind(null, client),
    blocks: blocks.bind(null, client),
    estimateFee: estimateFee.bind(null, client),
    jettonBurns: jettonBurns.bind(null, client),
    jettonMasters: jettonMasters.bind(null, client),
    jettonTransfers: jettonTransfers.bind(null, client),
    jettonWallets: jettonWallets.bind(null, client),
    masterchainBlockShards: masterchainBlockShards.bind(null, client),
    masterchainBlockShardState: masterchainBlockShardState.bind(null, client),
    masterchainInfo: masterchainInfo.bind(null, client),
    message: message.bind(null, client),
    messages: messages.bind(null, client),
    nftCollections: nftCollections.bind(null, client),
    nftItems: nftItems.bind(null, client),
    nftTransfers: nftTransfers.bind(null, client),
    runGetMethod: runGetMethod.bind(null, client),
    transactions: transactions.bind(null, client),
    transactionsByMasterchainBlock: transactionsByMasterchainBlock.bind(null, client),
    transactionsByMessage: transactionsByMessage.bind(null, client),
    wallet: wallet.bind(null, client),
  };
};

export type RpcClient = ReturnType<typeof adaptClientRpc>;
