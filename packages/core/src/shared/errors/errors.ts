import {
  UserUnauthorizedError,
  UserRejectedConnectionError,
  UserRejectedTransactionError,
} from './user-errors.js';
import {
  ConnectFunctionUnavailableError,
  ConnectUIFunctionUnavailableError,
  IncorrectContractError,
  MissingContractAddressError,
} from './syntax-errors.js';
import {
  TonConnectError,
  TonConnectUIError,
  TonWalletConnectionError,
  TonWalletDisconnectError,
  TonReadError,
  TonRateLimitError,
} from './ton-errors.js';

export type SupportedErrors = {
  // Syntax errors
  ConnectFunctionUnavailableError: ConnectFunctionUnavailableError,
  ConnectUIFunctionUnavailableError: ConnectUIFunctionUnavailableError,
  IncorrectContractError: IncorrectContractError,
  MissingContractAddressError: MissingContractAddressError,
  // User errors
  UserUnauthorizedError: UserUnauthorizedError,
  UserRejectedConnectionError: UserRejectedConnectionError,
  UserRejectedTransactionError: UserRejectedTransactionError,
  // TON errors
  TonConnectError: TonConnectError,
  TonConnectUIError: TonConnectUIError,
  TonWalletConnectionError: TonWalletConnectionError,
  TonWalletDisconnectError: TonWalletDisconnectError,
  TonReadError: TonReadError,
  TonRateLimitError: TonRateLimitError,
};

export const supportedErrors = {
  // Syntax errors
  ConnectFunctionUnavailableError: ConnectFunctionUnavailableError,
  ConnectUIFunctionUnavailableError: ConnectUIFunctionUnavailableError,
  IncorrectContractError: IncorrectContractError,
  MissingContractAddressError: MissingContractAddressError,
  // User errors
  UserUnauthorizedError: UserUnauthorizedError,
  UserRejectedConnectionError: UserRejectedConnectionError,
  UserRejectedTransactionError: UserRejectedTransactionError,
  // TON errors
  TonConnectError: TonConnectError,
  TonConnectUIError: TonConnectUIError,
  TonWalletConnectionError: TonWalletConnectionError,
  TonWalletDisconnectError: TonWalletDisconnectError,
  TonReadError: TonReadError,
  TonRateLimitError: TonRateLimitError,
}
