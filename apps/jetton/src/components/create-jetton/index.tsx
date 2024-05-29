import { FC, FormEventHandler, useState } from 'react';
import styles from './styles.module.css';
import { getJettonDeployArguments, parseTon } from '@fotonjs/core';
import { counterClient, publicClient, walletClient } from '../../ton-clients.ts';

export interface CreateJettonProps {
  userAddress?: string;
}

export const CreateJetton: FC<CreateJettonProps> = ({ userAddress }) => {
  const [address, setAddress] = useState<string | undefined>();

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
    const res = await counterClient.deploy({
      value: parseTon('0.05'),
      arguments: data,
      payload: undefined,
    });

    console.log('addr', res.data?.address);
    if (res.data) {
      setAddress(res.data.address);
      await publicClient.waitForTransaction({ hash: res.data.txHash });
    } else {
      setError(res.error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <h4 className={styles.h4}>Create new jetton</h4>
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
    </>
  );
};
