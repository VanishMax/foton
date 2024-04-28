import type { WalletClient } from './types.js';

export interface DisconnectOptions {

}

export async function disconnect (this: WalletClient, options?: DisconnectOptions): Promise<void> {
  return new Promise(async (resolve, reject) => {
    // Send a callback for a onStatusChange function to finish the connection on wallet change
    this._connectionCallbacks.push((wallet) => {
      if (wallet instanceof Error) {
        reject(wallet);
        return;
      }

      if (!wallet) {
        resolve();
      } else {
        reject(new Error('Could not disconnect from the wallet'));
      }
    });

    await this.connection.disconnect();
  });
}
