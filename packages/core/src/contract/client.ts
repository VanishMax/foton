import type { CompiledContract } from './helper-types.js';
import type { ContractClient, CreateContractClientOptions } from './types.js';
import { deployPredefinedContract } from './deploy-contract.js';

export const createContractClient = <CONTRACT extends CompiledContract>(options: CreateContractClientOptions<CONTRACT>) => {
  const { publicClient, walletClient, contract } = options;

  const client = {
    _publicClient: publicClient,
    _walletClient: walletClient,
    _contract: contract,
  } as ContractClient<CONTRACT>;

  client.deployContract = deployPredefinedContract.bind(client);

  return client;
};
