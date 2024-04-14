export type Hex = `0x${string}`;

interface ContractValueNum {
  type: 'num',
  value: Hex,
}
interface ContractValueCell {
  type: 'cell',
  value: string,
}
interface ContractValueSlice {
  type: 'slice',
  value: string,
}
export type ContractValue = ContractValueNum | ContractValueCell | ContractValueSlice;

export interface ContractRunGetMethodResponse {
  gas_used: number,
  // 0 is success, otherwise error
  exit_code: 0 | number,
  stack: ContractValue[];
}
