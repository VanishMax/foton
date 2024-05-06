import type { DataOrError } from './types.js';
import { SupportedErrors, supportedErrors } from './errors.js';

/**
 * A helper function to return a typed error in a form of `DataOrError`.
 */
export const returnError = <TYPE extends keyof typeof supportedErrors>(
  type: TYPE,
): DataOrError<any, SupportedErrors[TYPE]> => {
  const error = new supportedErrors[type]();

  return { data: undefined, error };
};
