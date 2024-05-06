import type { SupportedErrors } from './errors.js';

/** The main type to be returned from the functions. Returns either data or error */
export type DataOrError<DATA, ERROR extends Error = Error> =
  | { data: DATA; error: undefined }
  | { data: undefined; error: ERROR };


type ValuesType<T> = T[keyof T];
export type PickErrors<KEYS extends keyof SupportedErrors> = ValuesType<Pick<SupportedErrors, KEYS>>;

/**
 * An utility type that must be used for the core functions of Foton.
 *
 * For example, a function can have the following signature:
 * ```
 * type SendTransaction = (options) => Promise<DataOrTypedError<string, 'UserUnauthorizedError'>>
 * ```
 *
 * This would mean that the function can return either a string or the UserUnauthorizedError.
 */
export type DataOrTypedError<DATA, ERROR_KEYS extends keyof SupportedErrors> = DataOrError<DATA,  PickErrors<ERROR_KEYS>>;
