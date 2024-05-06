import type { DataOrError } from './types.js';

/**
 * A helper function to return data without error in a form of `DataOrError`.
 */
export const returnData = <DATA>(data: DATA): DataOrError<DATA> => {
  return { data, error: undefined };
};
