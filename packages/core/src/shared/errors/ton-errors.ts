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
  constructor(cause?: unknown) {
    super('Wallet connection failed');
    this.name = 'TonWalletConnectionError';
    this.cause = cause;
  }
}

export class TonWalletDisconnectError extends TonError {
  constructor(cause?: unknown) {
    super('Could not disconnect from the wallet');
    this.name = 'TonWalletDisconnectError';
    this.cause = cause;
  }
}

export class TonReadError extends TonError {
  constructor(cause?: unknown) {
    super('Cannot process the read request. Either the request returned a non-zero exit code or the data could not be parsed');
    this.name = 'TonReadError';
    this.cause = cause;
  }
}

export class TonRateLimitError extends TonError {
  constructor(cause?: unknown) {
    super('Rate limit is exceeded. Provide the `authKey` to the public client with a better Ton Center plan to get more requests per second');
    this.name = 'TonRateLimitError';
    this.cause = cause;
  }
}

export {
  TonConnectError,
};
