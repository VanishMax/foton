import type { Wallet, WalletClientBase, WalletInfo } from './types.js';
import { isTonConnectUI } from './utils.js';

const UNAVAILABLE_ERROR = 'This function is only available for UI-based wallet connections';

const openConnectionModal = async (client: WalletClientBase, connector?: WalletInfo): Promise<void> => {
  if (!isTonConnectUI(client.connection)) {
    throw new Error(UNAVAILABLE_ERROR);
  }

  if (connector) {
    await client.connection.openSingleWalletModal(connector.appName);
  } else {
    await client.connection.openModal();
  }
}

const closeConnectionModal = async (client: WalletClientBase, connector?: WalletInfo): Promise<void> => {
  if (!isTonConnectUI(client.connection)) {
    throw new Error(UNAVAILABLE_ERROR);
  }

  if (connector) {
    client.connection.closeSingleWalletModal();
  } else {
    client.connection.closeModal();
  }
}

export async function connectUI (this: WalletClientBase, connector?: WalletInfo): Promise<Wallet> {
  return new Promise(async (resolve, reject) => {
    if (!isTonConnectUI(this.connection)) {
      return reject(new Error(UNAVAILABLE_ERROR));
    }

    // Send a callback for a onStatusChange function to finish the connection on wallet change
    this._connectionCallbacks.push((wallet) => {
      if (wallet instanceof Error) {
        closeConnectionModal(this, connector);
        reject(wallet);
        return;
      }

      if (wallet) {
        resolve(wallet);
      } else {
        closeConnectionModal(this, connector);
        reject(new Error('Wallet connection failed'));
      }
    });

    // TODO: fix the error if modal closing is before the connection change
    // If the modal is closed, reject the promise with the error
    const unsubscribe = this.connection.onModalStateChange((state) => {
      if (state.status === 'closed') {
        unsubscribe();
        reject(new Error('User closed the connection modal'));
      }
    });

    await openConnectionModal(this, connector);
  });
}
