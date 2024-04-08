import type { FC } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

import { HomePage } from './page.tsx';

export const App: FC = () => {
  return (
    <TonConnectUIProvider manifestUrl="https://photon-counter.vercel.app/tonconnect-manifest.json">
      <HomePage />
    </TonConnectUIProvider>
  );
};
