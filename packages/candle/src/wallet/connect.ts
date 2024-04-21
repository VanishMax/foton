import { isWalletInfoInjectable, isWalletInfoRemote, type Wallet } from '@tonconnect/sdk';

import type { WalletClient, UserClient, WalletInfo } from './types.js';

export interface ConnectOptions {

}

async function connectWrapper (this: WalletClient, func: VoidFunction): Promise<Wallet | undefined> {
  return new Promise((resolve) => {
    const unsubscribe = this.connection.onStatusChange((wallet) => {
      // TODO: store callbacks for connect and reconnect functions
      unsubscribe();
      if (wallet) {
        this.connected = true;
        this.address = wallet.account.address;
        resolve(wallet);
      } else {
        this.connected = false;
        this.address = undefined;
        resolve(undefined);
      }
    });

    func();
  });
}

export async function connect (this: WalletClient, connector: WalletInfo, options?: ConnectOptions): Promise<UserClient> {
  if (isWalletInfoInjectable(connector) && connector.injected) {
    await connectWrapper.call(this, () => {
      this.connection.connect({
        // universalLink: connector.,
        jsBridgeKey: connector.jsBridgeKey,
      });
    });
  } else if (isWalletInfoRemote(connector)) {
    await connectWrapper.call(this, () => {
      const link = this.connection.connect({
        universalLink: connector.universalLink,
        bridgeUrl: connector.bridgeUrl,
      });
      console.log(link);
    });
  }

  return {
    ...this,
    address: this.address || '',
    disconnect: () => {},
    sendTransaction: async () => '',
    deployContract: async () => '',
  }
}
