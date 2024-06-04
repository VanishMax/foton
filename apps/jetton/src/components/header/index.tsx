import { FC } from 'react';
import fotonLogo from '/foton.png';

import { ConnectButton } from '../connect-button';
import { DisconnectButton } from '../disconnect-button';
import { useUserStore } from '../../stores/user-store.ts';
import styles from './styles.module.css';

export const AppHeader: FC = () => {
  const userAddress = useUserStore((state) => state.address);

  return (
    <header className={userAddress ? `${styles.header} ${styles.down}` : styles.header}>
      <a href="https://github.com/VanishMax/foton" target="_blank">
        <img src={fotonLogo} alt="Foton logo"/>
        <h1>Jetton</h1>
      </a>

      {!userAddress
        ? <ConnectButton />
        : <DisconnectButton />}
    </header>
  );
};
