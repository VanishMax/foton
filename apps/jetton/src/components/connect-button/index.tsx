import { FC } from 'react';
import { useUserStore } from '../../stores/user-store.ts';

export const ConnectButton: FC = () => {
  const loading = useUserStore((state) => state.loading);
  const connect = useUserStore((state) => state.connect);

  return (
    <button disabled={loading} onClick={connect}>
      {loading ? 'Loading...' : 'Connect'}
    </button>
  );
};
