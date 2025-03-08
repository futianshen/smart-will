import './App.css';

import { ConnectButton, useCurrentAccount, useSignTransaction, useSuiClient, useSuiClientQuery } from '@mysten/dapp-kit';
import { getFaucetHost, requestSuiFromFaucetV1 } from '@mysten/sui/faucet';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { MIST_PER_SUI } from '@mysten/sui/utils';

function App() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutateAsync: signTransaction } = useSignTransaction();

  if (account === null) {
    return <ConnectButton />;
  }

  async function sendTransaction() {
    const keypair = Ed25519Keypair.generate();

    try {
      const transaction = await signTransaction({
        sender: keypair.getPublicKey().toSuiAddress(),  // 使用生成的公钥作为发送者地址
        transaction: {
          kind: 'call',
          function: 'your_smart_contract_function', // 合约函数名称
        },
        signer: keypair,  // 使用私钥来签署交易
      });

      console.log('Transaction sent:', transaction);
    } catch (error) {
      console.error('Error executing transaction:', error);
    }
  }

  return (
    <main>
      <button onClick={async () => {
        // Convert MIST to SUI
        const balance = (balance) => {
          return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI);
        };

        // store the JSON representation for the SUI the address owns before using faucet
        const suiBefore = await suiClient.getBalance({
          owner: account?.address,
        });

        await requestSuiFromFaucetV1({
          host: getFaucetHost('devnet'),
          recipient: account?.address,
        });

        // store the JSON representation for the SUI the address owns after using faucet
        const suiAfter = await suiClient.getBalance({
          owner: account?.address,
        });

        // Output result to console.
        console.log(
          `Balance before faucet: ${balance(suiBefore)} SUI. Balance after: ${balance(
            suiAfter,
          )} SUI. Hello, SUI!`,
        );

      }}>Request SUI from Faucet</button>

      <button onClick={sendTransaction}>Call Smart Contract</button>

      <ConnectButton />

      {account && <>
        <div>Connected to {account.address}</div>
        <OwnedObjects address={account.address} />
      </>}
    </main>
  );
}

function OwnedObjects({ address }: { address: string }) {
  const { data } = useSuiClientQuery('getOwnedObjects', {
    owner: address,
  });

  if (!data) {
    return null;
  }

  return (
    <ul>
      {data.data.map((object) => (
        <li key={object.data?.objectId}>
          <a href={`https://example-explorer.com/object/${object.data?.objectId}`}>
            {object.data?.objectId}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default App;
