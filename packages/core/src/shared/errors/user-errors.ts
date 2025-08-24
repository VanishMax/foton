export class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserError';
  }
}

export class UserUnauthorizedError extends UserError {
  constructor(cause?: unknown) {
    super('Not authorized. Please, connect the wallet first');
    this.name = 'UserUnauthorizedError';
    this.cause = cause;
  }
}

export class UserRejectedConnectionError extends UserError {
  constructor(cause?: unknown) {
    super('User rejected the connection to their wallet');
    this.name = 'UserRejectedConnectionError';
    this.cause = cause;
  }
}

export class UserRejectedTransactionError extends UserError {
  constructor(cause?: unknown) {
    super('User rejected the transaction request from their wallet');
    this.name = 'UserRejectedTransactionError';
    this.cause = cause;
  }
}
