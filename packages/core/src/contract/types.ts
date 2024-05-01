import type { PublicClient } from '../public/index.js';
import type { WalletClientBase } from '../wallet/index.js';
import type { CompiledContract } from './helper-types.js';

import type { deployContract } from './deploy-contract.js';
import type { writeContract } from './write-contract.js';
import type { setAddress } from './set-address.js';

export interface CreateContractClientOptions<CONTRACT extends CompiledContract> {
  publicClient: PublicClient;
  walletClient: WalletClientBase;
  contract: CONTRACT;
  address?: string;
}

export interface ContractClient<CONTRACT extends CompiledContract> {
  _publicClient: PublicClient;
  _walletClient: WalletClientBase;
  _contract: CONTRACT;

  address?: string;
  setAddress: typeof setAddress;

  deployContract: typeof deployContract;
  writeContract: typeof writeContract;
}
