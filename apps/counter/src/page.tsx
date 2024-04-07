import { FC, useState } from 'react';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';

import photonLogo from '/photon.png';
import styles from './page.module.css';

export const HomePage: FC = () => {
  const [count, setCount] = useState(0);
  const address = useTonAddress();
  console.log(address);

  return (
    <>
      <header>
        <a href="https://github.com/VanishMax/photon" target="_blank">
          <img src={photonLogo} className={styles.logo} alt="Photon logo"/>
        </a>
        <h1>Photon counter</h1>
      </header>

      <div className={styles.card}>
        <TonConnectButton />

        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  );
};
