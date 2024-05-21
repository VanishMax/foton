import { useEffect, useState } from 'react';
import { parseTon, getJettonDeployArguments } from '@fotonjs/core';

import { counterClient, publicClient } from './ton-clients.ts';

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
    counterClient.setAddress(contractAddress);
  }, []);

  // Subscribe to the counter state with interval
  useEffect(() => {
    getCounterAmount();

    const interval = setInterval(getCounterAmount, 5000);
    return () => clearInterval(interval);
  }, [contractAddress]);

  const getCounterAmount = async () => {
    if (!contractAddress) return;

    const res = await counterClient.read({
      getter: 'owner',
      arguments: [],
    });
    if (res.data) {
      setCounterOwner(res.data);
    }
  };

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
    console.log(data);

    const res = await counterClient.deploy({
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

  const onIncrement = async () => {
    if (!contractAddress) return;

    setLoading(true);
    const res = await counterClient.write({
      method: 'Add',
      value: parseTon('0.05'),
      payload: {
        queryId: 1n,
        amount: 1n,
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

  const counterButtons = (
    <>
      <span>Counter: {counterOwner}</span>
      <button disabled={loading} onClick={onIncrement}>
        {loading ? 'Loading...' : 'Increment'}
      </button>
    </>
  );

  return {
    contractAddress,
    deployButton,
    counterButtons,
  };
};
