import { useEffect, useState } from 'react';
import { parseTon } from '@fotonjs/core';

import { counterClient, publicClient } from '../ton-clients.ts';

const LS_KEY = 'counter-contract-address';

export const useContract = () => {
  const [loading, setLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState<string | undefined>(localStorage.getItem(LS_KEY) as string || undefined);
  const [counterAmount, setCounterAmount] = useState<bigint | undefined>(undefined);

  const setAddress = (address: string) => {
    localStorage.setItem(LS_KEY, address);
    setContractAddress(address);
  };

  // Subscribe to the counter state with interval
  useEffect(() => {
    getCounterAmount();

    const interval = setInterval(getCounterAmount, 5000);
    return () => clearInterval(interval);
  }, [contractAddress]);

  const getCounterAmount = async () => {
    if (!contractAddress) return;

    const res = await counterClient.read({
      getter: 'counter',
      arguments: [],
    });
    if (res.data) {
      setCounterAmount(res.data);
    }
  };

  const onDeploy = async () => {
    const res = await counterClient.deploy({
      value: parseTon('0.05'),
      arguments: [1n, 1n],
      payload: {
        queryId: 1n,
      },
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
      await publicClient.waitForTransactionReceipt({ hash: res.data });
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
      <span>Counter: {counterAmount?.toString()}</span>
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
