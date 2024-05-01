import { Contract, Address } from '@ton/core';

interface ContractMethodArgs extends Record<string, unknown> {
  $$type: string;
}

export interface ExtendedContract extends Contract {
  send(arg_0: unknown, arg_1: unknown, arg_2: unknown, message: ContractMethodArgs): Promise<void>;
}

export interface CompiledContract {
  fromInit(): Promise<ExtendedContract>;
  fromAddress(address: Address): ExtendedContract;
}

export type GetExtendedContract<CONTRACT extends CompiledContract> = CONTRACT extends { fromInit(): Promise<infer T> } ? T : never;

/**
 * Takes a contract and returns a union-type of the method arguments that a contract can run.
 *
 * For example, given contract (in Tact) has only one receiver `receive(msg: Add)`, then the contract has methods `Add | Deploy`,
 * and the type will be `{ $$type: 'Add', amount: bigint } | { $$type: 'Deploy', queryId: bigint }`.
 */
export type ContractMethods<CONTRACT extends CompiledContract> = Parameters<GetExtendedContract<CONTRACT>['send']>[3];

/**
 * Takes a contract and a key of the method, and returns the method's arguments.
 *
 * For example, given contract (in Tact) has only one receiver `receive(msg: Add)`,
 * then running `ContractMethod<Contract, 'Add'>` will return `{ amount: bigint }`.
 */
export type ContractMethod<CONTRACT extends CompiledContract, KEY extends string>
  = ContractMethods<CONTRACT> extends { $$type: infer TYPE }
    ? TYPE extends KEY
      ? Omit<Extract<ContractMethods<CONTRACT>, { $$type: TYPE }>, '$$type'>
      : never
  : never;
