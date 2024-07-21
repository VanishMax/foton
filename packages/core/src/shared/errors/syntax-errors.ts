export class SyntaxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SyntaxError';
  }
}

export class ConnectFunctionUnavailableError extends SyntaxError {
  constructor() {
    super('This function is not available for UI-based wallet connections. Use `createWalletClientUI` instead');
    this.name = 'ConnectFunctionUnavailableError';
  }
}

export class ConnectUIFunctionUnavailableError extends SyntaxError {
  constructor() {
    super('This function is only available for UI-based wallet connections');
    this.name = 'ConnectUIFunctionUnavailableError';
  }
}


export class ConnectUIFunctionUnavailableInNodeError extends SyntaxError {
  constructor() {
    super('This function is not available in the server environment. Please you `createWalletClient` instead or, if you use Next.js, call `createWalletClientUI` in `useEffect` hook or in the event handler, so it creates a wallet client when the `window` is available.');
    this.name = 'ConnectUIFunctionUnavailableInNodeError';
  }
}

export class ReconnectFunctionUnavailableError extends SyntaxError {
  constructor() {
    super('The reconnect is not available for UI-based wallet connections. Pass `restoreConnection: true` to the `createWalletClientUI` function to enable it');
    this.name = 'ReconnectFunctionUnavailableError';
  }
}

export class IncorrectContractError extends SyntaxError {
  constructor() {
    super('The contract is incorrect. Provide the contract class compiled from your Tact or Func files');
    this.name = 'IncorrectContractError';
  }
}

export class MissingContractAddressError extends SyntaxError {
  constructor() {
    super('The contract address is not provided to the walletClient. Call `setAddress` first');
    this.name = 'MissingContractAddressError';
  }
}
