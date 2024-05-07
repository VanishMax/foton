import { FC, useEffect, useState } from 'react';

import { parseTon } from '@fotonjs/core';

import styles from './page.module.css';
import { walletClient, publicClient, counterClient } from './ton-clients';

import { AppHeader } from './components/header';

const useCounterAddress = (): [string | undefined, (arg: string) => void] => {
  const [counterAddress, setContractAddress] = useState<string | undefined>(localStorage.getItem('counterAddress') as string || undefined);

  const setCounterAddress = (address: string) => {
    localStorage.setItem('counterAddress', address);
    setContractAddress(address);
  };

  return [counterAddress, setCounterAddress];
};

export const App: FC = () => {
  const [counterAddress, setCounterAddress] = useCounterAddress();
  const [counterAmount, setCounterAmount] = useState<bigint | undefined>(undefined);

  const [loading, setLoading] = useState(false);

  const [userAddress, setUserAddress] = useState<string>();

  useEffect(() => {
    walletClient.connection.onStatusChange((wallet) => {
      if (wallet) {
        setUserAddress(wallet.account.address);
      } else {
        setUserAddress(undefined);
      }
    });
  }, []);

  useEffect(() => {
    getCounterAmount();
    const interval = setInterval(getCounterAmount, 5000);
    return () => clearInterval(interval);
  }, [counterAddress]);

  const onDeploy = async () => {
    const res = await counterClient.deploy({
      value: parseTon('0.05'),
      arguments: [1n, 1n],
      payload: {
        queryId: 1n,
      },
    });

    if (res.data) {
      counterClient.setAddress(res.data.address);
      setCounterAddress(res.data.address);
    }
  };

  const getCounterAmount = async () => {
    if (!counterAddress) {
      return;
    }
    const res = await counterClient.read({
      getter: 'counter',
      arguments: [],
    });
    if (res.data) {
      setCounterAmount(res.data);
    }
  };

  const onConnect = async () => {
    await walletClient.connect();
  };

  const onDisconnect = async () => {
    await walletClient.disconnect();
  };

  const onCount = async () => {
    if (!counterAddress) return;
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
    }
    setLoading(false);
  };

  return (
    <>
      <AppHeader/>

      {!userAddress && (
        <div className={styles.actions}>
          <button onClick={onConnect}>
            Connect to TON
          </button>
        </div>
      )}

      {userAddress && (
        <>
          <div className={styles.actions}>
            {userAddress && counterAddress && counterAmount !== undefined && (
              <button disabled={loading} onClick={onCount}>
                {loading ? 'Loading...' : (
                  <>
                    count is {counterAmount.toString()}
                  </>
                )}
              </button>
            )}
          </div>

          {!counterAddress && (
            <div className={styles.actions}>
              <button onClick={onDeploy}>
                Deploy Counter contract
              </button>
              <button onClick={onDisconnect}>
                Disconnect
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};
