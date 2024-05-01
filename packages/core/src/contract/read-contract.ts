// import type { ContractClient } from './types.js';
// import type { CompiledContract, ContractGetterNames } from './helper-types.js';
//
// export async function readContract<CONTRACT extends CompiledContract, GETTER extends ContractGetterNames<CONTRACT>> (
//   this: ContractClient<CONTRACT>,
//   getter: ContractGetterNames<CONTRACT>
// ): Promise<unknown> {
//   if (!this._walletClient.connected || !this._walletClient.address) {
//     throw new Error('Not authorized. Please, connect the wallet first');
//   }
//
//   const fullContract = await this._contract.fromInit();
//
//   if (!fullContract.abi) {
//     throw new Error('Incorrect contract. Please, provide the contract class compiled from your Tact or Func contract');
//   }
//
//   const contractAddress = fullContract.address.toString();
