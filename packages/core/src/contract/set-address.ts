import type { ContractClient } from './types.js';
import type { CompiledContract } from './helper-types.js';

export function setAddress <CONTRACT extends CompiledContract>(
  this: ContractClient<CONTRACT>,
  address: string | undefined,
): void {
  this.address = address;
}
