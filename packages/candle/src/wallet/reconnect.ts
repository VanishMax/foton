import type { WalletClient, Wallet } from './types.js';

export interface ReconnectOptions {

}

export async function reconnect (this: WalletClient, options?: ReconnectOptions): Promise<Wallet> {
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

    await this.connection.restoreConnection();
  });
}
