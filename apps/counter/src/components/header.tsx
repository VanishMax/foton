import { FC } from 'react';
import fotonLogo from '/foton.png';
import styles from '../page.module.css';

export const AppHeader: FC = () => {
  return (
    <header>
      <a href="https://github.com/VanishMax/foton" target="_blank">
        <img src={fotonLogo} className={styles.logo} alt="Foton logo"/>
      </a>
      <h1>Foton counter</h1>
    </header>
  );
};
