import type { FC } from 'react';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';

const Layout: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
};

export default Layout;
