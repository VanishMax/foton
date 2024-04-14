import { Contract, Address } from '@ton/core';

export interface ExtendedContract {
  fromInit(): Promise<Contract>;
  fromAddress(address: Address): Contract;
}

export type Hex = `0x${string}`;

// /runGetMethod typings

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

// /transactionsByMessage typings

export interface TransactionMessage {
  hash: string,
  source: string | null,
  destination: string | null,
  value: number | null,
  fwd_fee: number | null,
  ihr_fee: number | null,
  created_lt: number | null,
  created_at: number | null,
  opcode: number,
  ihr_disabled: boolean | null,
  bounce: boolean | null,
  bounced: boolean | null,
  import_fee: number | null,
  message_content: {
    hash: string,
    body: string,
    decoded: null
  },
}

export interface TransactionAccountState {
  hash: string,
  balance: number,
  account_status: 'active',
  frozen_hash: string | null,
  code_hash: string,
  data_hash: string,
}

export interface TransactionDescription {
  type: 'ord',
  action: {
    valid: boolean,
    success: boolean,
    no_funds: boolean,
    result_code: number,
    tot_actions: number,
    msgs_created: number,
    spec_actions: number,
    tot_msg_size: {
      bits: number,
      cells: number,
    },
    status_change: 'unchanged',
    total_fwd_fees: number,
    skipped_actions: number,
    action_list_hash: string,
    total_action_fees: number,
  },
  bounce: {
    type: 'negfunds'
  },
  aborted: boolean,
  credit_ph: {
    credit: number,
    due_fees_collected: number,
  },
  destroyed: boolean,
  compute_ph: {
    mode: number,
    type: 'vm',
    success: boolean,
    gas_fees: number,
    gas_used: number,
    vm_steps: number,
    exit_code: number,
    gas_limit: number,
    gas_credit: number,
    msg_state_used: boolean,
    account_activated: boolean,
    vm_init_state_hash: string,
    vm_final_state_hash: string,
  },
  storage_ph: {
    status_change: 'unchanged',
    storage_fees_collected: number
  },
  credit_first: boolean
}

export interface Transaction {
  account: Hex,
  hash: string,
  lt: number,
  now: number,
  orig_status: 'active',
  end_status: 'active',
  total_fees: number,
  prev_trans_hash: string,
  prev_trans_lt: number,
  block_ref: {
    workchain: number,
    shard: number,
    seqno: number
  },
  description: TransactionDescription,
  in_msg: TransactionMessage,
  out_msgs: TransactionMessage[],
  account_state_before: TransactionAccountState,
  account_state_after: TransactionAccountState,
  mc_block_seqno: number,
}

export interface TransactionsByMessageResponse {
  transactions: Transaction[],
  address_book: Record<string, {
    user_friendly: string,
  }>,
}
