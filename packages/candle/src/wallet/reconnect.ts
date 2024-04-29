import type { WalletClient, Wallet } from './types.js';
import { isTonConnectUI } from './utils.js';

export interface ReconnectOptions {

}

export async function reconnect (this: WalletClient, options?: ReconnectOptions): Promise<Wallet> {
  return new Promise(async (resolve, reject) => {
    if (isTonConnectUI(this.connection)) {
      return reject(new Error('The reconnect is not available for UI-based wallet connections. Pass `restoreConnection: true` to the `createWalletClientUI` function to enable it.'));
    }

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
