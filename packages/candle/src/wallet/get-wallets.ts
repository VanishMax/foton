import { isWalletInfoCurrentlyInjected, isWalletInfoInjectable, isWalletInfoRemote, isWalletInfoCurrentlyEmbedded } from '@tonconnect/sdk';
import type { WalletClient, WalletInfo } from './types.js';

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

export async function getWallets (this: WalletClient, options?: GetWalletsOptions): Promise<WalletInfo[]> {
  const { type = 'all' } = options || {};

  if (this.wallets?.length) {
    return filterWallets(this.wallets, type);
  }

  const wallets = await this.connection.getWallets();
  this.wallets = wallets;

  return filterWallets(wallets, type);
}
