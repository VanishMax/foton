import type { DataOrError } from './types.js';
import {
  SupportedErrors,
  supportedErrors,
  SupportedErrorsKeys,
} from './errors.js';

/**
 * A helper function to return a typed error in a form of `DataOrError`.
 */
export const returnError = <TYPE extends SupportedErrorsKeys>(
  type: TYPE,
  cause?: Error
): DataOrError<any, SupportedErrors[TYPE]> => {
  const nativeTonErrors: SupportedErrorsKeys[] = ['TonConnectError', 'TonConnectUIError'] as const;

  const errorClass = supportedErrors[type]

  if (nativeTonErrors.includes(type)) {
    const error = new errorClass();

    return { data: undefined, error: error as SupportedErrors[TYPE] };
  }

  const error = new errorClass(cause as any);

  return { data: undefined, error: error as SupportedErrors[TYPE] };
};
