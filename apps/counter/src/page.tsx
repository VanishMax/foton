import { FC, useEffect, useState } from 'react';
import { TonConnectButton, useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import fotonClient from '@foton/client';

import fotonLogo from '/foton.png';
import styles from './page.module.css';
import { deployContract } from './wallet-api/deploy.ts';
import { setCounter } from './wallet-api/set-counter.ts';
import { getCounter } from './public-api/get-counter.ts';
import type { Hex } from './public-api/types.ts';
import { waitForTransactionReceipt } from './public-api/wait-for-transaction-receipt.ts';

const useCounterAddress = (): [Hex | undefined, (arg: Hex) => void] => {
  const [counterAddress, setContractAddress] = useState<Hex | undefined>(localStorage.getItem('counterAddress') as Hex || undefined);

  const setCounterAddress = (address: Hex) => {
    localStorage.setItem('counterAddress', address);
    setContractAddress(address);
  };

  return [counterAddress, setCounterAddress];
};

export const HomePage: FC = () => {
  const [tonConnection] = useTonConnectUI();
  const [counterAddress, setCounterAddress] = useCounterAddress();
  const [counterAmount, setCounterAmount] = useState<bigint | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const userAddress = useTonAddress();

  const onDeploy = async () => {
    const contractAddress = await deployContract(fotonClient.counter, tonConnection);

    if (!contractAddress) return;
    setCounterAddress(contractAddress);
  };

  const getCounterAmount = async () => {
    if (!counterAddress) {
      return;
    }

    setCounterAmount(await getCounter(counterAddress));
  };

  useEffect(() => {
    getCounterAmount();
    const interval = setInterval(getCounterAmount, 5000);

    return () => clearInterval(interval);
  }, [counterAddress]);

  const onCount = async () => {
    if (!counterAddress) return;
    setLoading(true);
    const txHash = await setCounter(counterAddress, tonConnection);
    if (txHash) {
      await waitForTransactionReceipt(txHash);
    }
    setLoading(false);
  };

  return (
    <>
      <header>
        <a href="https://github.com/VanishMax/foton" target="_blank">
          <img src={fotonLogo} className={styles.logo} alt="Foton logo"/>
        </a>
        <h1>Foton counter</h1>
      </header>

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

        <TonConnectButton/>
      </div>

      {!counterAddress && (
        <div className={styles.actions}>
          <button onClick={onDeploy}>
            Deploy Counter contract
          </button>
        </div>
      )}
    </>
  );
};
