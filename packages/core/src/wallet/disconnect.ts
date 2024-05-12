import type { WalletClientBase } from './types.js';
import { DataOrTypedError, returnData, returnError } from '../shared/errors/index.js';

type DisconnectReturn = DataOrTypedError<boolean, 'TonWalletDisconnectError' | 'TonConnectError'>;

export async function disconnect (this: WalletClientBase): Promise<DisconnectReturn> {
  return new Promise(async (resolve) => {
    // Send a callback for a onStatusChange function to finish the connection on wallet change
    this._connectionCallbacks.push((wallet) => {
      if (wallet instanceof Error) {
        return resolve({ error: wallet, data: undefined });
      }

      if (!wallet) {
        resolve(returnData(true));
      } else {
        resolve(returnError('TonWalletDisconnectError'));
      }
    });

    await this.connection.disconnect();
  });
}
