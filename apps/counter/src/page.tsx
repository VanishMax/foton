import { FC, useEffect, useState } from 'react';
import { TonConnectButton, useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import photonClient from '@photon/client';

import photonLogo from '/photon.png';
import styles from './page.module.css';
import { deployContract } from './utils/deploy.ts';
import { getCounter } from './utils/get-counter.ts';

const useCounterAddress = (): [string | undefined, (arg: string) => void] => {
  const [counterAddress, setContractAddress] = useState<string | undefined>(localStorage.getItem('counterAddress') || undefined);

  const setCounterAddress = (address: string) => {
    localStorage.setItem('counterAddress', address);
    setContractAddress(address);
  };

  return [counterAddress, setCounterAddress];
};

export const HomePage: FC = () => {
  const [count, setCount] = useState(0);

  const [tonConnection] = useTonConnectUI();
  const [counterAddress, setCounterAddress] = useCounterAddress();
  const [counter, setCounter] = useState<bigint | undefined>(undefined);

  const userAddress = useTonAddress();

  const onDeploy = async () => {
    const contractAddress = await deployContract(photonClient.counter, tonConnection);

    if (!contractAddress) return;
    setCounterAddress(contractAddress);
  };

  useEffect(() => {
    if (!counterAddress) {
      return;
    }

    const interval = setInterval(async () => {
      setCounter(await getCounter(counterAddress));
    }, 5000);

    return () => clearInterval(interval);
  }, [counterAddress]);

  return (
    <>
      <header>
        <a href="https://github.com/VanishMax/photon" target="_blank">
          <img src={photonLogo} className={styles.logo} alt="Photon logo"/>
        </a>
        <h1>Photon counter</h1>
      </header>

      <div className={styles.actions}>
        {userAddress && counterAddress && counter !== undefined && (
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
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
