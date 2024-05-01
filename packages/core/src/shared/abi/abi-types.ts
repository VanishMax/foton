import type { ContractABI, ABIType, ABIField } from '@ton/core';

//
// Block of making ContractAPI a deep-readonly object, to align with abi

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

type DeepReadonly<T> =
  T extends (infer R)[] ? DeepReadonlyArray<R> :
    T extends Function ? T :
      T extends object ? DeepReadonlyObject<T> :
        T;

type ConstantContractABI = DeepReadonly<ContractABI>;
type ConstantContractABIType = DeepReadonly<ABIType>;

//
// Block of taking the abi.receivers and producing a union type of their names: 'Add' | 'Deploy'
// These will become keys of the Contract interface

type Definitely<T> = Exclude<T, null | undefined>; // A type opposite to Maybe

type AbiReceivers<ABI extends ConstantContractABI> = Definitely<ABI['receivers']>[number]['message'];

type AbiTypedReceiverNames<ABI extends ConstantContractABI> = AbiReceivers<ABI> extends {
  kind: 'typed',
  type: string
} ? AbiReceivers<ABI>['type'] : never;

type AbiTextReceiverNames<ABI extends ConstantContractABI> = AbiReceivers<ABI> extends {
  kind: 'text',
  text?: string | null
} ? Definitely<AbiReceivers<ABI>['text']> : never;

type ABIReceiverNames<ABI extends ConstantContractABI> = AbiTypedReceiverNames<ABI> | AbiTextReceiverNames<ABI>;

//
// Block of working with the field types.
// E.g. taking `{ name: 'bounced', type: { kind: 'simple', type: 'bool' } }` and producing `{ bounced: boolean }`

// TODO: add support for kind:'dict' field type
export type AbiFieldType = 'uint' | 'int' | 'cell' | 'slice' | 'address' | 'bool';

type AbiFieldMap = {
  uint: bigint;
  int: bigint;
  cell: string;
  slice: string;
  address: string;
  bool: boolean;
} & Record<string, string>;

type AbiFieldRefType<ABI_FIELD extends ABIField> = ABI_FIELD['type'] extends {
  kind: 'simple',
  type: string,
} ? ABI_FIELD['type']['type'] : never;

type AbiFieldValue<ABI_FIELD extends ABIField> = AbiFieldMap[AbiFieldRefType<ABI_FIELD>];

//
// Block of taking the abi.types and producing values for the Contract interface

type FindByName<Arr extends Readonly<any[]>, Key extends string> = Arr extends Readonly<(infer Item)[]>
  ? Item extends { name: Key }
    ? Item
    : never
  : never;

type AbiMethodFields<ABI_TYPE extends ConstantContractABIType> = ABI_TYPE['fields'][number]['name'];
type AbiMethodFieldsMapping<ABI_TYPE extends ConstantContractABIType> = {
  [NAME in AbiMethodFields<ABI_TYPE>]: AbiFieldValue<FindByName<Definitely<ABI_TYPE['fields']>, NAME>>
};

//
// Final composing of the expected contract interface

// TODO: export types like the ones from the Abitype: https://abitype.dev/api/types

export type ContractMethods<ABI extends ConstantContractABI> = {
  [METHOD in ABIReceiverNames<ABI>]: AbiMethodFieldsMapping<FindByName<Definitely<ABI['types']>, METHOD>>
};
