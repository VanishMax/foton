import { FC } from 'react';
import { useUserStore } from '../../stores/user-store.ts';
import { shortenAddress } from '../../utils/shortenAddress.ts';
import styles from './styles.module.css';

export interface DisconnectButtonProps {}

export const DisconnectButton: FC<DisconnectButtonProps> = () => {
  const address = useUserStore((state) => state.address);
  const loading = useUserStore((state) => state.loading);
  const changeSection = useUserStore((state) => state.changeSection);
  const disconnect = useUserStore((state) => state.disconnect);

  return (
    <div className={styles.account}>
      <span>{shortenAddress(address)}</span>

      <button type="button" onClick={() => changeSection('minters')}>My jettons</button>

      <button disabled={loading} onClick={disconnect}>
        {loading ? 'Loading...' : 'Disconnect'}
      </button>
    </div>
  );
};
