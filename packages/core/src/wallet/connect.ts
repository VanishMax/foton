import { isWalletInfoInjectable, isWalletInfoRemote } from '@tonconnect/sdk';

import type { Wallet, WalletClientBase, WalletInfo } from './types.js';
import { isTonConnect } from './utils.js';
import { type DataOrTypedError, returnData, returnError } from '../shared/errors/index.js';

type ConnectReturn = DataOrTypedError<Wallet, 'ConnectFunctionUnavailableError' | 'TonConnectUIError' | 'TonWalletConnectionError' | 'UserRejectedConnectionError'>;

export async function connect (
  this: WalletClientBase,
  connector: WalletInfo,
): Promise<ConnectReturn> {
  return new Promise(async (resolve, reject) => {
    if (!isTonConnect(this.connection)) {
      return resolve(returnError('ConnectFunctionUnavailableError'));
    }

    // Send a callback for a onStatusChange function to finish the connection on wallet change
    this._connectionCallbacks.push((wallet) => {
      if (wallet instanceof Error) {
        return resolve({ error: wallet, data: undefined });
      }

      if (wallet) {
        resolve(returnData(wallet));
      } else {
        resolve(returnError('TonWalletConnectionError'));
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
