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
