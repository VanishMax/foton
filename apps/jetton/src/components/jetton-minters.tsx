import { FC, useEffect, useState } from 'react';
import { JettonMaster } from '@fotonjs/api';
import { publicClient } from '../ton-clients.ts';
import styles from './jetton-minters.module.css';
import { shortenAddress } from '../utils/shortenAddress.ts';

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

export interface JettonMintersProps {
  userAddress?: string;
}

export const JettonMinters: FC<JettonMintersProps> = ({ userAddress }) => {
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
    }
  }, [userAddress]);

  if (!minters.length) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h4>My jettons</h4>

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
              <button>Manage</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </section>
  );
};
