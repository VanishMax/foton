import type { FC } from 'react';

import { AppHeader } from './components/header';
import { useAccount } from './hooks/useAccount.tsx';
import { useContract } from './hooks/useContract.tsx';
import styles from './page.module.css';

export const App: FC = () => {
  const { userAddress, connectButton, disconnectButton} = useAccount();
  const { contractAddress, deployButton, counterButtons } = useContract();

  return (
    <>
      <AppHeader/>

      {!userAddress && (
        <div className={styles.actions}>
          {connectButton}
        </div>
      )}

      {!!userAddress && (
        <div className={styles.actions}>
          <span>{userAddress}</span>
          {disconnectButton}
        </div>
      )}

      {!!userAddress && !contractAddress && (
        <div className={styles.actions}>
          {deployButton}
        </div>
      )}

      {!!userAddress && !!contractAddress && (
        <div className={styles.actions}>
          {counterButtons}
        </div>
      )}
    </>
  );
};
