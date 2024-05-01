import type { CompiledContract } from './helper-types.js';
import type { ContractClient, CreateContractClientOptions } from './types.js';
import { deployContract } from './deploy-contract.js';
import { writeContract } from './write-contract.js';
import { setAddress } from './set-address.js';

export const createContractClient = <CONTRACT extends CompiledContract>(options: CreateContractClientOptions<CONTRACT>) => {
  const { publicClient, walletClient, contract } = options;

  const client = {
    _publicClient: publicClient,
    _walletClient: walletClient,
    _contract: contract,

    // TODO: simplify contract address management
    address: options.address,
  } as ContractClient<CONTRACT>;

  client.deploy = deployContract.bind(client);
  client.write = writeContract.bind(client) as typeof writeContract;
  client.setAddress = setAddress.bind(client);

  return client;
};
