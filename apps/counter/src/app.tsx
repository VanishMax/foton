import { FC, useState } from 'react';

import photonLogo from '/photon.png';
import styles from './app.module.css';

export const App: FC = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <header>
        <a href="https://github.com/VanishMax/photon" target="_blank">
          <img src={photonLogo} className={styles.logo} alt="Photon logo"/>
        </a>
        <h1>Photon counter</h1>
      </header>
      <div className={styles.card}>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  );
};
