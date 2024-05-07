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
