import type { PublicClient } from '../public/index.js';
import type { WalletClientBase } from '../wallet/index.js';
import type { CompiledContract } from './helper-types.js';
import type { deployPredefinedContract } from './deploy-contract.js';

export interface CreateContractClientOptions<CONTRACT extends CompiledContract> {
  publicClient: PublicClient;
  walletClient: WalletClientBase;
  contract: CONTRACT;
}

export interface ContractClient<CONTRACT extends CompiledContract> {
  _publicClient: PublicClient;
  _walletClient: WalletClientBase;
  _contract: CONTRACT;

  address: string;

  deployContract: typeof deployPredefinedContract;
}
