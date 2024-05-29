import { FC, useEffect, useState } from 'react';
import { JettonMaster } from '@fotonjs/api';
import { publicClient } from '../../ton-clients.ts';
import styles from './styles.module.css';
import { shortenAddress } from '../../utils/shortenAddress.ts';
import { useUserStore } from '../../stores/user-store.ts';

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
}

export interface JettonMintersProps {}

export const JettonMinters: FC<JettonMintersProps> = () => {
  const userAddress = useUserStore((state) => state.address);
  const changeSection = useUserStore((state) => state.changeSection);

  const [minters, setMinters] = useState<JettonMinter[]>([]);

  const fetchJettonMinters = async (address: string): Promise<void> => {
    const res = await publicClient._api.jettonMasters({ admin_address: address });
    if (res.data) {
      setMinters(res.data.jetton_masters as JettonMinter[]);
    }
  };

  useEffect(() => {
    if (userAddress) {
      fetchJettonMinters(userAddress);
    } else {
      setMinters([]);
    }
  }, [userAddress]);

  if (!minters.length) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h4>My jettons</h4>
        <button type="button" onClick={() => changeSection('create')}>Create new jetton</button>
      </div>

      <table className={styles.table}>
        <thead>
        <tr>
          <th>Symbol</th>
          <th>Name</th>
          <th>Total supply</th>
          <th>Address</th>
          <th />
        </tr>
        </thead>
        <tbody>
        {minters.map((minter) => (
          <tr key={minter.address}>
            <td>${minter.jetton_content.symbol}</td>
            <td>{minter.jetton_content.name}</td>
            <td>{minter.total_supply}</td>
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
              <button type="button" onClick={() => changeSection('manage')}>Manage</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </section>
  );
};
