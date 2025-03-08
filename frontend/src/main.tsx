import '@mysten/dapp-kit/dist/index.css';

import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider
        defaultNetwork="testnet"
        networks={{
          localnet: { url: getFullnodeUrl("localnet") },
          devnet: { url: getFullnodeUrl('devnet') },
          testnet: { url: getFullnodeUrl('testnet') },
          mainnet: { url: getFullnodeUrl('mainnet') },
        }
        }
      >
        <WalletProvider>
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </StrictMode >,
)



