import { FC, FormEventHandler, useState } from 'react';
import styles from './styles.module.css';
import { getJettonDeployArguments, parseTon } from '@fotonjs/core';
import { contractClient, publicClient, walletClient } from '../../ton-clients.ts';
import { AppSection } from '../section';
import { useUserStore } from '../../stores/user-store.ts';

export interface CreateJettonProps {}

export const CreateJetton: FC<CreateJettonProps> = () => {
  const changeSection = useUserStore((state) => state.changeSection);
  const userAddress = useUserStore((state) => state.address);

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');

  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const onConnect = () => {
    walletClient.connect();
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    setError(undefined);
    if (!name || !symbol || !description) {
      setError('Please, fill in all fields');
      return;
    }

    const data = getJettonDeployArguments({
      owner: userAddress!,
      maxSupply: 21000000n,
      content: {
        name: 'Foton',
        symbol: 'FTN',
        description: 'Foton token',
      },
    });

    setLoading(true);
    const res = await contractClient.deploy({
      value: parseTon('0.05'),
      arguments: data,
      payload: undefined,
    });

    if (res.data) {
      await publicClient.waitForTransaction({ hash: res.data.txHash });
      changeSection('minters');
    } else {
      setError(res.error.message);
    }
    setLoading(false);
  };

  return (
    <AppSection title="Create new jetton">
      <form onSubmit={onSubmit} className={styles.form}>
        <fieldset className={styles.field}>
          <label htmlFor="jetton-name">Project name</label>
          <input
            value={name} id="jetton-name"
            name="jetton-name"
            type="text"
            placeholder="Bitcoin"
            onInput={(event) => setName(event.currentTarget.value)}
          />
        </fieldset>

        <fieldset className={styles.field}>
          <label htmlFor="jetton-symbol">Jetton symbol</label>
          <input
            value={symbol}
            id="jetton-symbol"
            name="jetton-symbol"
            type="text"
            placeholder="BTC"
            onInput={(event) => setSymbol(event.currentTarget.value)}
          />
        </fieldset>

        <fieldset className={styles.field}>
          <label htmlFor="jetton-description">Description</label>
          <input
            value={description}
            id="jetton-description"
            name="jetton-description"
            type="text"
            onInput={(event) => setDescription(event.currentTarget.value)}
          />
        </fieldset>

        {error && <p className={styles.error}>{error}</p>}

        {userAddress ? (
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Create and deploy'}
          </button>
        ) : (
          <button type="button" onClick={onConnect}>Connect wallet</button>
        )}
      </form>
    </AppSection>
  );
};
