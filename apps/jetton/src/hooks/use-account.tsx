import { useEffect, useState } from 'react';

import { walletClient } from '../ton-clients.ts';

export const useAccount = () => {
  const [loading, setLoading] = useState(false);
  const [userAddress, setUserAddress] = useState<string>();

  const onConnect = async () => {
    setLoading(true);
    await walletClient.connect();
    setLoading(false);
  };

  const onDisconnect = async () => {
    setLoading(true);
    await walletClient.disconnect();
    setLoading(false);
  };

  const connectButton = (
    <button disabled={loading} onClick={onConnect}>
      {loading ? 'Loading...' : 'Connect'}
    </button>
  );

  const disconnectButton = (
    <button disabled={loading} onClick={onDisconnect}>
      {loading ? 'Loading...' : 'Disconnect'}
    </button>
  );

  useEffect(() => {
    walletClient.connection.onStatusChange((wallet) => {
      if (wallet) {
        setUserAddress(wallet.account.address);
      } else {
        setUserAddress(undefined);
      }
    });
  }, []);

  return {
    userAddress,
    connectButton,
    disconnectButton,
  };
};
