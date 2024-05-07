export class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserError';
  }
}

export class UserUnauthorizedError extends UserError {
  constructor() {
    super('Not authorized. Please, connect the wallet first');
    this.name = 'UserUnauthorizedError';
  }
}

export class UserRejectedConnectionError extends UserError {
  constructor() {
    super('User rejected the connection to their wallet');
    this.name = 'UserRejectedConnectionError';
  }
}
