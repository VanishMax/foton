import { UserUnauthorizedError, UserRejectedConnectionError } from './user-errors.js';
import { ConnectFunctionUnavailableError, ConnectUIFunctionUnavailableError } from './syntax-errors.js';
import { TonConnectError, TonConnectUIError, TonWalletConnectionError } from './ton-errors.js';

export type SupportedErrors = {
  UserUnauthorizedError: UserUnauthorizedError,
  UserRejectedConnectionError: UserRejectedConnectionError,
  ConnectFunctionUnavailableError: ConnectFunctionUnavailableError,
  ConnectUIFunctionUnavailableError: ConnectUIFunctionUnavailableError,
  TonConnectError: TonConnectError,
  TonConnectUIError: TonConnectUIError,
  TonWalletConnectionError: TonWalletConnectionError,
};

export const supportedErrors = {
  UserUnauthorizedError: UserUnauthorizedError,
  UserRejectedConnectionError: UserRejectedConnectionError,
  ConnectFunctionUnavailableError: ConnectFunctionUnavailableError,
  ConnectUIFunctionUnavailableError: ConnectUIFunctionUnavailableError,
  TonConnectError: TonConnectError,
  TonConnectUIError: TonConnectUIError,
  TonWalletConnectionError: TonWalletConnectionError,
}
