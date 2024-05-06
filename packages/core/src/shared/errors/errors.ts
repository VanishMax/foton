import { UserUnauthorizedError } from './user-errors.js';

export type SupportedErrors = {
  UserUnauthorizedError: UserUnauthorizedError,
};

export const supportedErrors = {
  UserUnauthorizedError: UserUnauthorizedError,
}
