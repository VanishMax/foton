import fotonLogo from '/foton.png';

import './App.css';
import { useAccount } from './use-account.tsx';
import { useContract } from './use-contract.tsx';

function App() {
  const { connectButton, disconnectButton, userAddress, address } = useAccount();
  const { contractAddress, deployButton } = useContract(address);

  return (
    <>
      <header>
        <a href="https://github.com/VanishMax/foton" target="_blank">
          <img src={fotonLogo} alt="Foton logo"/>
        </a>
        <h1>Foton Jetton</h1>
      </header>

      {!userAddress && (
        <div className="card">
          {connectButton}
        </div>
      )}

      {!!userAddress && (
        <div className="card">
          <span>{userAddress}</span>
          {disconnectButton}
        </div>
      )}

      {!!userAddress && !contractAddress && (
        <div className="card">
          {deployButton}
        </div>
      )}
    </>
  );
}

export default App;
