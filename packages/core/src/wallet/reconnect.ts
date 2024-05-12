import type { WalletClient, Wallet } from './types.js';
import { isTonConnectUI } from './utils.js';
import { DataOrTypedError, returnError, returnData } from '../shared/errors/index.js';

type ReconnectReturn = DataOrTypedError<Wallet, 'ReconnectFunctionUnavailableError' | 'TonWalletConnectionError' | 'TonConnectError' | 'TonConnectUIError'>;

export async function reconnect (this: WalletClient): Promise<ReconnectReturn> {
  return new Promise(async (resolve) => {
    if (isTonConnectUI(this.connection)) {
      return resolve(returnError('ReconnectFunctionUnavailableError'));
    }

    if (this._wallet) {
      return returnData(this._wallet);
    }

    // Send a callback for a onStatusChange function to finish the connection on wallet change
    this._connectionCallbacks.push((wallet) => {
      if (wallet instanceof Error) {
        return resolve({ error: wallet, data: undefined });
      }

      if (wallet) {
        return resolve(returnData(wallet));
      } else {
        return resolve(returnError('TonWalletConnectionError'));
      }
    });

    await this.connection.restoreConnection();
  });
}
