import { FC, ReactNode } from 'react';
import styles from './styles.module.css';

export interface AppSectionProps {
  title: string;
  children: ReactNode;
  headerItem?: ReactNode;
}

export const AppSection: FC<AppSectionProps> = ({ title, headerItem, children }) => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h4>{title}</h4>
        {headerItem}
      </div>

      {children}
    </section>
  );
};
