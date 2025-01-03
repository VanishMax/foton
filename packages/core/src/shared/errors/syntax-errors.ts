export class SyntaxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SyntaxError';
  }
}

export class ConnectFunctionUnavailableError extends SyntaxError {
  constructor(cause?: Error) {
    super('This function is not available for UI-based wallet connections. Use `createWalletClientUI` instead');
    this.name = 'ConnectFunctionUnavailableError';
    this.cause = cause;
  }
}

export class ConnectUIFunctionUnavailableError extends SyntaxError {
  constructor(cause?: Error) {
    super('This function is only available for UI-based wallet connections');
    this.name = 'ConnectUIFunctionUnavailableError';
    this.cause = cause;
  }
}


export class ConnectUIFunctionUnavailableInNodeError extends SyntaxError {
  constructor(cause?: Error) {
    super('This function is not available in the server environment. Please you `createWalletClient` instead or, if you use Next.js, call `createWalletClientUI` in `useEffect` hook or in the event handler, so it creates a wallet client when the `window` is available.');
    this.name = 'ConnectUIFunctionUnavailableInNodeError';
    this.cause = cause;
  }
}

export class ReconnectFunctionUnavailableError extends SyntaxError {
  constructor(cause?: Error) {
    super('The reconnect is not available for UI-based wallet connections. Pass `restoreConnection: true` to the `createWalletClientUI` function to enable it');
    this.name = 'ReconnectFunctionUnavailableError';
    this.cause = cause;
  }
}

export class IncorrectContractError extends SyntaxError {
  constructor(cause?: Error) {
    super('The contract is incorrect. Provide the contract class compiled from your Tact or Func files');
    this.name = 'IncorrectContractError';
    this.cause = cause;
  }
}

export class MissingContractAddressError extends SyntaxError {
  constructor(cause?: Error) {
    super('The contract address is not provided to the walletClient. Call `setAddress` first');
    this.name = 'MissingContractAddressError';
    this.cause = cause;
  }
}
