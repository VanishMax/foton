import type { Wallet, WalletClientBase, WalletInfo } from './types.js';
import { isTonConnectUI } from './utils.js';
import { returnError, DataOrTypedError, returnData } from '../shared/errors/index.js';
import { TonConnectUI } from '@tonconnect/ui';

const openConnectionModal = async (client: WalletClientBase, connector?: WalletInfo): Promise<void> => {
  const connection = client.connection as TonConnectUI;
  if (connector) {
    await connection.openSingleWalletModal(connector.appName);
  } else {
    await connection.openModal();
  }
}

const closeConnectionModal = async (client: WalletClientBase, connector?: WalletInfo): Promise<void> => {
  const connection = client.connection as TonConnectUI;
  if (connector) {
    connection.closeSingleWalletModal();
  } else {
    connection.closeModal();
  }
}

type ConnectUiReturn = DataOrTypedError<Wallet, 'ConnectUIFunctionUnavailableError' | 'TonConnectUIError' | 'TonWalletConnectionError' | 'UserRejectedConnectionError'>;

export async function connectUI (
  this: WalletClientBase,
  connector?: WalletInfo
): Promise<ConnectUiReturn> {
  return new Promise(async (resolve) => {
    if (this._wallet) {
      return resolve(returnData(this._wallet));
    }

    if (!isTonConnectUI(this.connection)) {
      return resolve(returnError('ConnectUIFunctionUnavailableError'));
    }

    // Send a callback for a onStatusChange function to finish the connection on wallet change
    this._connectionCallbacks.push((wallet) => {
      if (wallet instanceof Error) {
        closeConnectionModal(this, connector);
        return resolve({ error: wallet, data: undefined });
      }

      if (wallet) {
        return resolve(returnData(wallet));
      } else {
        closeConnectionModal(this, connector);
        return resolve(returnError('TonWalletConnectionError'));
      }
    });

    // If the modal is closed, reject the promise with the error
    const unsubscribe = this.connection.onModalStateChange((state) => {
      if (state.status === 'closed') {
        setTimeout(() => { // Set timeout, so the function fires after the wallet state change
          unsubscribe();
          resolve(returnError('UserRejectedConnectionError'));
        });
      }
    });

    await openConnectionModal(this, connector);
  });
}
