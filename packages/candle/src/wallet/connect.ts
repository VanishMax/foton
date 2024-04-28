import { isWalletInfoInjectable, isWalletInfoRemote } from '@tonconnect/sdk';

import type { Wallet, WalletClient, WalletInfo } from './types.js';

export interface ConnectOptions {

}

export async function connect (this: WalletClient, connector: WalletInfo, options?: ConnectOptions): Promise<Wallet> {
  return new Promise(async (resolve, reject) => {
    // Send a callback for a onStatusChange function to finish the connection on wallet change
    this._connectionCallbacks.push((wallet) => {
      if (wallet instanceof Error) {
        reject(wallet);
        return;
      }

      if (wallet) {
        resolve(wallet);
      } else {
        reject(new Error('Wallet connection failed'));
      }
    });

    if (isWalletInfoInjectable(connector) && connector.injected) {
      this.connection.connect({
        jsBridgeKey: connector.jsBridgeKey,
      });
    } else if (isWalletInfoRemote(connector)) {
      const link = this.connection.connect({
        universalLink: connector.universalLink,
        bridgeUrl: connector.bridgeUrl,
      });
      if (typeof window === 'undefined') {
        console.info(`Open the following link in your browser to connect with ${connector.name}: ${link}`);
        console.info(link);
      } else {
        window.open(link, '_blank');
      }
      // TODO: support other types of wallets, e.g. embedded
    }
  });
}
