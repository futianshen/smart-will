import {
  // ConnectButton,
  // useCurrentAccount,
  useSuiClientQuery
} from '@mysten/dapp-kit';
import { useState } from 'react';
import './App.css';
import CreateWillPage from './pages/CreateWillPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';

function App() {
  const [page, setPage] = useState<'landing' | 'dashboard' | 'create-will'>('create-will')
  // const account = useCurrentAccount();

  console.log({ page })

  return (
    <main>
      {page === "landing" && <LandingPage setPage={setPage} />}
      {page === "dashboard" && <DashboardPage setPage={setPage} />}
      {page === "create-will" && <CreateWillPage setPage={setPage} />}
      {/* {account && (
        <>
          <div>Connected to {account.address}</div>
          <OwnedObjects address={account.address} />
        </>
      )} */}
    </main>
  );
}

function OwnedObjects({ address }: { address: string }) {
  const { data } = useSuiClientQuery('getOwnedObjects', { owner: address });

  if (!data) return null;

  return (
    <ul>
      {data.data.map((object) => (
        <li key={object.data?.objectId}>
          <a href={`https://suiscan.xyz/testnet/object/${object.data?.objectId}/tx-blocks`} target="_blank" rel="noopener noreferrer">
            {object.data?.objectId}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default App;
