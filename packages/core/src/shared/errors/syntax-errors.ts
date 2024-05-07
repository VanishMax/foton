export class SyntaxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SyntaxError';
  }
}

export class ConnectFunctionUnavailableError extends SyntaxError {
  constructor() {
    super('This function is not available for UI-based wallet connections. Use `createWalletClientUI` instead.');
    this.name = 'ConnectFunctionUnavailableError';
  }
}

export class ConnectUIFunctionUnavailableError extends SyntaxError {
  constructor() {
    super('This function is only available for UI-based wallet connections');
    this.name = 'ConnectUIFunctionUnavailableError';
  }
}
