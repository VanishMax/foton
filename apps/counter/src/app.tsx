import type { FC } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

import manifestUrl from '/tonconnect-manifest.json?url';
import { HomePage } from './page.tsx';

export const App: FC = () => {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <HomePage />
    </TonConnectUIProvider>
  );
};
