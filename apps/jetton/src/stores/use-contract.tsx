import { useEffect, useState } from 'react';
import { parseTon, getJettonDeployArguments } from '@fotonjs/core';

import { contractClient, publicClient } from '../ton-clients.ts';

const LS_KEY = 'jetton-contract-address';

export const useContract = (userAddress?: string) => {
  const [loading, setLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState<string | undefined>(localStorage.getItem(LS_KEY) || undefined);
  const [counterOwner, setCounterOwner] = useState<string | undefined>(undefined);

  const setAddress = (address: string) => {
    localStorage.setItem(LS_KEY, address);
    setContractAddress(address);
  };

  // Set contract address for the contractClient on initial render
  useEffect(() => {
    contractClient.setAddress(contractAddress);
  }, []);

  // Subscribe to the counter state with interval
  // useEffect(() => {
  //   getCounterAmount();
  //
  //   const interval = setInterval(getCounterAmount, 5000);
  //   return () => clearInterval(interval);
  // }, [contractAddress]);

  // const getCounterAmount = async () => {
  //   if (!contractAddress) return;
  //
  //   const res = await contractClient.read({
  //     getter: 'owner',
  //     arguments: [],
  //   });
  //   if (res.data) {
  //     setCounterOwner(res.data);
  //   }
  // };

  const onDeploy = async () => {
    const data = getJettonDeployArguments({
      owner: userAddress!,
      maxSupply: 21000000n,
      content: {
        name: 'Foton',
        symbol: 'FTN',
        description: 'Foton token',
      },
    });

    const res = await contractClient.deploy({
      value: parseTon('0.05'),
      arguments: data,
      payload: undefined,
    });

    if (res.data) {
      setAddress(res.data.address);
    } else {
      alert(res.error.message);
    }
  };

  const onMint = async () => {
    if (!contractAddress) return;

    setLoading(true);
    const res = await contractClient.write({
      method: 'Mint',
      value: parseTon('0.05'),
      payload: {
        amount: 100n,
        receiver: userAddress!,
      },
    });
    if (res.data) {
      await publicClient.waitForTransaction({ hash: res.data });
    } else {
      alert(res.error?.message || '');
    }
    setLoading(false);
  };

  const deployButton = (
    <button onClick={onDeploy}>
      Deploy Counter contract
    </button>
  );

  const mintButton = (
    <>
      <button disabled={loading} onClick={onMint}>
        {loading ? 'Loading...' : 'Mint'}
      </button>
    </>
  );

  return {
    contractAddress,
    deployButton,
    mintButton,
  };
};
