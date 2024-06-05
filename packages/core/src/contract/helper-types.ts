import type { Address, Contract } from '@ton/core';

interface ContractMethodMessage extends Record<string, unknown> {
  $$type: string;
}
type ContractMethodArgs = ContractMethodMessage | string | null;

export interface ExtendedContract extends Contract {
  send(arg_0: unknown, arg_1: unknown, arg_2: unknown, message: ContractMethodArgs): Promise<void>;
}

export interface CompiledContract {
  fromInit(...args: any): Promise<ExtendedContract>;
  fromAddress(address: Address): ExtendedContract;
}

export type GetExtendedContract<CONTRACT extends CompiledContract> = CONTRACT extends { fromInit(...args: any): Promise<infer T> } ? T : never;

// Types for the contract methods (actions that write state, require fees)

// A helper method that transforms any Address type to string in a contract's payload
type MapMethodPayload<T> = {
  [K in keyof T]: T[K] extends Address
    ? string
    : T[K];
};

/**
 * Takes a contract and returns a union-type of the method arguments that a contract can run.
 *
 * For example, given contract (in Tact) has only one receiver `receive(msg: Add)`, then the contract has methods `Add | Deploy`,
 * and the type will be `{ $$type: 'Add', amount: bigint } | { $$type: 'Deploy', queryId: bigint }`.
 */
export type ContractMethods<CONTRACT extends CompiledContract> = Parameters<GetExtendedContract<CONTRACT>['send']>[3];

// The following types collect the method names from the contract. Are composed into a union type in ContractMethodNames
type ContractMethodNamesKeyed<CONTRACT extends CompiledContract> =
  Extract<ContractMethods<CONTRACT>, string> extends string ? Extract<ContractMethods<CONTRACT>, string> : never;
type ContractMethodNamesEmpty<CONTRACT extends CompiledContract> =
  Extract<ContractMethods<CONTRACT>, null> extends null ? 'empty' : never;
type ContractMethodNamesMessage<CONTRACT extends CompiledContract> =
  Exclude< // add support for receive(msg: MSG)
    Exclude<ContractMethods<CONTRACT>, string | null> extends ContractMethodMessage
      ? Exclude<ContractMethods<CONTRACT>, string | null>['$$type']
      : ContractMethods<CONTRACT> extends null
        ? 'empty'
        : ContractMethods<CONTRACT> extends string
          ? ContractMethods<CONTRACT>
          : string,
    'Deploy'
  >;

/**
 * Takes a contract and returns a union-type of the available method names, without deploy method.
 *
 * For example, given contract (in Tact) has two receivers `receive(msg: Add)` and `receive(msg: Subtract)`,
 * then the type will be `'Add' | 'Subtract'`.
 *
 * Different contract receivers all map to a string method name. Here is the mapping:
 * 1. `receive(msg: Add)` -> `'Add'`
 * 2. `receive("increment")` -> `'increment'`
 * 3. `receive(str: String)` -> `string`, any string method name is allowed
 * 4. `receive()` -> `'empty'`, requires passing 'empty' explicitly
 */
export type ContractMethodNames<CONTRACT extends CompiledContract> =
  | ContractMethodNamesMessage<CONTRACT> // add support for receive(msg: MSG)
  | ContractMethodNamesKeyed<CONTRACT> // add support for receive(str: String) and receive("increment")
  | ContractMethodNamesEmpty<CONTRACT> // add support for receive()

/**
 * Takes a contract and a key of the method, and returns the method's arguments.
 *
 * For example, given contract (in Tact) has only one receiver `receive(msg: Add)`,
 * then running `ContractMethod<Contract, 'Add'>` will return `{ amount: bigint }`.
 */
export type ContractMethod<CONTRACT extends CompiledContract, KEY extends string>
  = Exclude<ContractMethods<CONTRACT>, string | null> extends { $$type: infer TYPE } // If receiver is a message
    ? TYPE extends KEY // find specific message to get the arguments
      ? MapMethodPayload<Omit<Extract<ContractMethods<CONTRACT>, { $$type: TYPE }>, '$$type'>> // store argument of the specific message without $$type, map Address to string
      : undefined
    : undefined; // else – receive is a string (str: String), no payload is required

/**
 * Takes a contract and return an array of the required arguments for the deploy method.
 *
 * For example, given contract (in Tact) has a constructor defined as `init(id: Int, count: Int)`,
 * then the type will be `[arg0: bigint, arg1: bigint]`.
 */
export type ContractDeployArguments<CONTRACT extends CompiledContract> = Parameters<CONTRACT['fromInit']>;

// Types for the contract getters (actions that read the state)

type WithoutFirst<T extends any[]> = T extends [any, ...infer Rest] ? Rest : never;

type SnakeCaseHelper<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${First extends Capitalize<First> ? `_${Lowercase<First>}` : First}${SnakeCaseHelper<Rest>}`
  : S;
type SnakeCase<S extends string> = S extends `${infer First}${infer Rest}` // changes ThisLiteralType to this_literal_type
  ? `${Lowercase<First>}${SnakeCaseHelper<Rest>}`
  : S;

export type CamelCase<S extends string> = S extends `${infer First}_${infer Next}${infer Rest}`
  ? `${First}${Capitalize<Next>}${CamelCase<Rest>}` // transforms snake_case to camelCase
  : S;

type ExtractGetterNames<CONTRACT extends CompiledContract> = Exclude<{
  [K in keyof GetExtendedContract<CONTRACT>]: GetExtendedContract<CONTRACT>[K] extends Function // Check if the property is a function
    ? K extends `get${string}`
      ? K
      : never
    : never
}[keyof GetExtendedContract<CONTRACT>], undefined>;

type CapitalizeGetter<GETTER extends string> = `get${Capitalize<GETTER>}`;
type GetCapitalizedGetter<GETTER extends string, CONTRACT extends ExtendedContract> =
  CapitalizeGetter<GETTER> extends keyof CONTRACT ? CONTRACT[CapitalizeGetter<GETTER>] : never;

/**
 * Takes a contract and returns a union-type of the getter names.
 * Contract getters request data from the contract without modifying it.
 *
 * For example, given contract (in Tact) has two getters `get fun balance` and `get fun counter`,
 * then the type will be `balance | counter`.
 */
export type ContractGetterNames<CONTRACT extends CompiledContract> =
  ExtractGetterNames<CONTRACT> extends `get${infer REST}` // Check if the name starts with 'get'
    ? SnakeCase<REST> | Uncapitalize<REST> // Remove 'get' and uncapitalize the first letter of the rest + make the same type of snake_case because Tact compiler transforms such casing to camelCase
    : never;

/**
 * Takes a contract and returns a record of the getter names and their arguments.
 * Contract getters request data from the contract without modifying it.
 *
 * For example, given contract (in Tact) has two getters `get fun balance(initial: Int): Int` and `get fun counter(): Int`,
 * then the type will be `{ balance: [bigint], counter: [] }`.
 */
export type ContractGetters<CONTRACT extends CompiledContract> = {
  [key in CamelCase<ContractGetterNames<CONTRACT>>]: GetCapitalizedGetter<key, GetExtendedContract<CONTRACT>> extends (...args: any) => any
    ? WithoutFirst<Parameters<GetCapitalizedGetter<key, GetExtendedContract<CONTRACT>>>>
    : never;
}

// Simple utility that extract the type from a promise
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

// Getters from the contract do not always return the same type as the readContract function.
// For example, Address should be mapped to plain string, bigint to number, etc.
type MapGetterReturn<T> =
  T extends bigint
    ? number
    : T extends Address
      ? string
      : T;

/**
 * Takes a contract with a getter name, and gets the return type of the getter.
 *
 * For example, for a contract (in Tact) with a getter `get fun balance(initial: Int): Int`,
 * the type will be `bigint`.
 */
export type ContractGetterReturn<CONTRACT extends CompiledContract, GETTER extends ContractGetterNames<CONTRACT>> =
  GetCapitalizedGetter<GETTER, GetExtendedContract<CONTRACT>> extends (...args: any) => any
    ? MapGetterReturn<UnwrapPromise<ReturnType<GetCapitalizedGetter<GETTER, GetExtendedContract<CONTRACT>>>>>
    : unknown;
