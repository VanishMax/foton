import { useMemo, useState } from 'react';

import { walletClient } from './ton-clients.ts';

export const useAccount = () => {
  const [loading, setLoading] = useState(false);
  const [userAddress, setUserAddress] = useState<string>();

  const shortAddress = useMemo(() => {
    if (!userAddress) return '';
    return userAddress.slice(0, 6) + '...' + (userAddress || '').slice(-4);
  }, [userAddress]);

  const onConnect = async () => {
    setLoading(true);
    const res = await walletClient.connect();
    if (res.error) {
      alert(res.error.message);
    } else {
      setUserAddress(res.data.account.address);
    }
    setLoading(false);
  };

  const onDisconnect = async () => {
    setLoading(true);
    const res = await walletClient.disconnect();
    if (res.data) {
      setUserAddress(undefined);
    }
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

  return {
    address: userAddress,
    userAddress: shortAddress,
    connectButton,
    disconnectButton,
  };
};
