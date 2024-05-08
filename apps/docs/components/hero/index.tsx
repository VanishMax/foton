import { FC } from 'react';
import styles from './styles.module.css';

export const Hero: FC = () => {
  return (
    <section className={styles.hero}>
      <h1>Foton</h1>
      <p>Create TON dApps with the speed of a foton</p>
      <a href="/docs">Get started</a>
    </section>
  )
};
