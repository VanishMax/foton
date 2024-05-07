import { TonConnectError } from '@tonconnect/sdk';

export class TonConnectUIError extends TonConnectError {
  constructor(...args: ConstructorParameters<typeof Error>) {
    super(...args);

    Object.setPrototypeOf(this, TonConnectUIError.prototype);
  }
}

export class TonError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TonError';
  }
}

export class TonWalletConnectionError extends TonError {
  constructor() {
    super('Wallet connection failed');
    this.name = 'TonWalletConnectionError';
  }
}

export {
  TonConnectError,
};
