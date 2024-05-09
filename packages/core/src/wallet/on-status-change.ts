import { WalletClientBase } from './types.js';

/**
 * Manages wallet connection status and execute callbacks from the connect and reconnect functions
 */
export function onStatusChange (this: WalletClientBase): void {
  this._connectionCallbacks = [];
  this.connection.onStatusChange((wallet) => {
    if (wallet) {
      this.connected = true;
      this._wallet = wallet;
      this.address = wallet.account.address;
    } else {
      this.connected = false;
      this._wallet = undefined;
      this.address = undefined;
    }
    this._connectionCallbacks.forEach((cb) => cb(wallet));
  }, (error) => {
    this._connectionCallbacks.forEach((cb) => cb(error));
  });
}
