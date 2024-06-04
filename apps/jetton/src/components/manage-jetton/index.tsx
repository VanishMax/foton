import { FC, FormEventHandler, useState } from 'react';
import styles from './styles.module.css';
import { AppSection } from '../section';
import { contractClient, publicClient } from '../../ton-clients.ts';
import { parseTon } from '@fotonjs/core';

type ActionTabs = 'mint' | 'transfer' | 'burn';

export interface ManageJettonProps {}

export const ManageJetton: FC<ManageJettonProps> = () => {
  const [tab, setTab] = useState<ActionTabs>('mint');

  const [mintAmount, setMintAmount] = useState('');
  const [receiver, setReceiver] = useState('');

  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const onMint: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    setError(undefined);
    if (!mintAmount || !receiver) {
      setError('Please, fill in all fields');
      return;
    }

    setLoading(true);
    const res = await contractClient.write({
      method: 'Mint',
      value: parseTon('0.05'),
      payload: {
        receiver,
        amount: BigInt(mintAmount),
      }
    });

    if (res.data) {
      await publicClient.waitForTransaction({ hash: res.data });
    } else if (res.error) {
      alert(res.error.message);
    }
    setLoading(false);
  };

  return (
    <AppSection title="Manage Jetton">
      <div className={styles.wrapper}>
        <nav className={styles.tabs}>
          <button className={tab === 'mint' ? styles.active : ''} onClick={() => setTab('mint')}>Mint</button>
          <button className={tab === 'transfer' ? styles.active : ''} onClick={() => setTab('transfer')}>Transfer</button>
          <button className={tab === 'burn' ? styles.active : ''} onClick={() => setTab('burn')}>Burn</button>
        </nav>

        {tab === 'mint' && (
          <form className={styles.form} onSubmit={onMint}>
            <fieldset className={styles.field}>
              <label htmlFor="jetton-amount">Amount to mint, in nano values</label>
              <input
                value={mintAmount}
                id="jetton-amount"
                name="jetton-amount"
                type="text"
                placeholder="1000000000"
                onInput={(event) => setMintAmount(event.currentTarget.value)}
              />
            </fieldset>

            <fieldset className={styles.field}>
              <label htmlFor="jetton-receiver">Receiver address</label>
              <input
                value={receiver}
                id="jetton-receiver"
                name="jetton-receiver"
                type="text"
                placeholder="0x:abc...def"
                onInput={(event) => setReceiver(event.currentTarget.value)}
              />
            </fieldset>

            {error && <p className={styles.error}>{error}</p>}

            <button disabled={loading} type="submit">
              {loading ? 'Loading...' : 'Mint'}
            </button>
          </form>
        )}
      </div>
    </AppSection>
  );
};
