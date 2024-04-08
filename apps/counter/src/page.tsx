import { FC, useState } from 'react';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import photonClient from '@photon/client';

import photonLogo from '/photon.png';
import styles from './page.module.css';
import { useDeployContract } from './utils/deploy.ts';
import { getCounter } from './utils/get-counter.ts';

export const HomePage: FC = () => {
  const [count, setCount] = useState(0);
  const address = useTonAddress();

  const deployCounter = useDeployContract(photonClient.counter);

  const onDeploy = async () => {
    const contractAddress = await deployCounter();

    if (!contractAddress) return;
    setInterval(async () => {
      getCounter(contractAddress);
    }, 5000);
  };

  return (
    <>
      <header>
        <a href="https://github.com/VanishMax/photon" target="_blank">
          <img src={photonLogo} className={styles.logo} alt="Photon logo"/>
        </a>
        <h1>Photon counter</h1>
      </header>

      <div className={styles.actions}>
        {address && (
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        )}

        <TonConnectButton/>
      </div>

      <div className={styles.actions}>
        <button onClick={onDeploy}>
          Deploy Counter contract
        </button>
      </div>
    </>
  );
};
