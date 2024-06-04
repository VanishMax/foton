import { FC, useEffect, useState } from 'react';
import { JettonMaster, JettonWallet } from '@fotonjs/api';
import { contractClient, publicClient } from '../../ton-clients.ts';
import { shortenAddress } from '../../utils/shortenAddress.ts';
import { useUserStore } from '../../stores/user-store.ts';
import { AppSection } from '../section';
import styles from './styles.module.css';

interface JettonMetadata {
  name: string;
  description: string;
  symbol: string;
  image: string;
  imageData: string;
  uri: string;
  decimals: number;
  amount_style: 'n' | 'n-of-total' | '%';
  render_type: 'currency' | 'game';
}

interface JettonMinter extends JettonMaster {
  jetton_content: JettonMetadata;
  balance: bigint;
}

export interface JettonMintersProps {}

export const JettonMinters: FC<JettonMintersProps> = () => {
  const userAddress = useUserStore((state) => state.address);
  const changeSection = useUserStore((state) => state.changeSection);

  const [minters, setMinters] = useState<JettonMinter[]>([]);

  const fetchJettonMinters = async (address: string): Promise<void> => {
    const [minters, wallets] = await Promise.all([
      publicClient._api.jettonMasters({ admin_address: address }),
      publicClient._api.jettonWallets({ owner_address: address }),
    ]);
    let mintersData = (minters.data?.jetton_masters || []) as JettonMinter[];
    const walletsData = (wallets.data?.jetton_wallets || []) as JettonWallet[];

    mintersData = mintersData.map((minter) => {
      const balance = walletsData.reduce((accum, wallet) => {
        console.log(wallet.jetton, minter.address, wallet.jetton === minter.address, BigInt(wallet.balance));
        if (wallet.jetton === minter.address) {
          return accum + BigInt(wallet.balance);
        }
        return accum;
      }, 0n);

      return {
        ...minter,
        balance,
      };
    });

    setMinters(mintersData);
  };

  useEffect(() => {
    if (userAddress) {
      fetchJettonMinters(userAddress);
    } else {
      setMinters([]);
    }
  }, [userAddress]);

  const onManage = (address: string) => {
    contractClient.setAddress(address);
    changeSection('manage');
  };

  if (!minters.length) {
    return null;
  }

  return (
    <AppSection
      title="My jettons"
      headerItem={<button type="button" onClick={() => changeSection('create')}>Create new jetton</button>}
    >
      <table className={styles.table}>
        <thead>
        <tr>
          <th>Symbol</th>
          <th>Name</th>
          <th>Total supply</th>
          <th>Balance</th>
          <th>Address</th>
          <th/>
        </tr>
        </thead>
        <tbody>
        {minters.map((minter) => (
          <tr key={minter.address}>
            <td>${minter.jetton_content.symbol}</td>
            <td>{minter.jetton_content.name}</td>
            <td>{minter.total_supply}</td>
            <td>{minter.balance?.toString() || '0'}</td>
            <td>
              <a
                key={`symbol-${minter.address}`}
                href={`https://testnet.tonviewer.com/` + minter.address}
                target="_blank"
                rel="noreferrer"
              >
                {shortenAddress(minter.address)}
              </a>
            </td>
            <td>
              <button type="button" onClick={() => onManage(minter.address)}>Manage</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </AppSection>
  );
};
