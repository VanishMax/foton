import fotonLogo from '/foton.png';

import './App.css';
import { useAccount } from './hooks/use-account.tsx';
import { JettonMinters } from './components/jetton-minters.tsx';
import { shortenAddress } from './utils/shortenAddress.ts';
import { CreateJetton } from './components/create-jetton.tsx';
import { ManageJetton } from './components/manage-jetton.tsx';

function App() {
  const { connectButton, disconnectButton, userAddress } = useAccount();

  return (
    <>
      <header>
        <a href="https://github.com/VanishMax/foton" target="_blank">
          <img src={fotonLogo} alt="Foton logo"/>
          <h1>Jetton</h1>
        </a>

        {!userAddress
          ? connectButton
          : (
            <div>
              <span>{shortenAddress(userAddress)}</span>
              {disconnectButton}
            </div>
          )}
      </header>

      <JettonMinters userAddress={userAddress} />
      <CreateJetton userAddress={userAddress} />

      <ManageJetton />
    </>
  );
}

export default App;
