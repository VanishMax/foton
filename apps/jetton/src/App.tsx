import { useEffect } from 'react';
import { useUserStore } from './stores/user-store.ts';
import { JettonMinters } from './components/jetton-minters';
import { CreateJetton } from './components/create-jetton';
import { ManageJetton } from './components/manage-jetton';
import { AppHeader } from './components/header';
import './App.css';

function App() {
  const userAddress = useUserStore((state) => state.address);
  const activeSection = useUserStore((state) => state.activeSection);
  const monitorAuth = useUserStore((state) => state.monitorAuth);

  useEffect(() => {
    monitorAuth();
  }, [monitorAuth]);

  return (
    <>
      <AppHeader />

      {activeSection === 'minters' && <JettonMinters />}
      {activeSection === 'create' && <CreateJetton userAddress={userAddress} />}
      {activeSection === 'manage' && <ManageJetton />}
    </>
  );
}

export default App;
