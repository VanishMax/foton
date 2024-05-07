import { isWalletInfoCurrentlyInjected, isWalletInfoInjectable, isWalletInfoRemote, isWalletInfoCurrentlyEmbedded } from '@tonconnect/sdk';
import type { WalletClientBase, WalletInfo } from './types.js';
import { type DataOrError, returnData } from '../shared/errors/index.js';

type WalletFilterType = 'all' | 'injected' | 'injectable' | 'remote' | 'embedded';

export interface GetWalletsOptions {
  type?: WalletFilterType;
}

const filterFunction: Record<WalletFilterType, ((wallet: WalletInfo) => void) | null> = {
  all: null,
  injected: isWalletInfoCurrentlyInjected,
  injectable: isWalletInfoInjectable,
  remote: isWalletInfoRemote,
  embedded: isWalletInfoCurrentlyEmbedded,
};

const filterWallets = (wallets: WalletInfo[], type: WalletFilterType) => {
  const filter = filterFunction[type];
  if (!filter) {
    return wallets;
  }
  return wallets.filter(filter);
};

export async function getWallets (this: WalletClientBase, options?: GetWalletsOptions): Promise<DataOrError<WalletInfo[]>> {
  const { type = 'all' } = options || {};

  if (this.wallets?.length) {
    return returnData(filterWallets(this.wallets, type));
  }

  const wallets = await this.connection.getWallets();
  this.wallets = wallets;

  return returnData(filterWallets(wallets, type));
}
