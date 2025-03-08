import {
  ConnectButton,
  useCurrentAccount,
  useSignTransaction,
  useSuiClient,
  useSuiClientQuery
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import './App.css';

function App() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutateAsync: signTransaction } = useSignTransaction();

  if (!account) {
    return <ConnectButton />;
  }

  // async function sendTransaction() {
  //   const keypair = Ed25519Keypair.generate();

  //   try {
  //     const transaction = await signTransaction({
  //       sender: keypair.getPublicKey().toSuiAddress(),  // 使用生成的公钥作为发送者地址
  //       transaction: {
  //         kind: 'call',
  //         function: 'your_smart_contract_function', // 合约函数名称
  //       },
  //       signer: keypair,  // 使用私钥来签署交易
  //     });

  //     console.log('Transaction sent:', transaction);
  //   } catch (error) {
  //     console.error('Error executing transaction:', error);
  //   }
  // }

  const handleTransaction = async () => {
    try {
      const packageId = "0x200ab82b1ecb6b9f2ba5d5b79989d317c5d84d5ba8851ce093e7f8d87b64c7e0";  // Replace with actual package ID
      const moduleName = 'hello_world';
      const functionName = 'mint';
      const gasBudget = 300000000;

      // Create a new transaction instance
      const transaction = new Transaction();

      // Add a function call to the transaction
      transaction.moveCall({
        target: `${packageId}::${moduleName}::${functionName}`,
        arguments: [],
      });

      // Set gas budget
      transaction.setGasBudget(gasBudget);

      // Sign the transaction
      const signedTx = await signTransaction({
        transaction: transaction as any,
        chain: 'sui:testnet',
      });

      console.log('Signed Transaction:', signedTx);

      // Execute the transaction
      const executeResult = await client.executeTransactionBlock({
        transactionBlock: signedTx.bytes,
        signature: signedTx.signature,
        options: { showRawEffects: true },
      });

      console.log('Transaction Execution Result:', executeResult);

      // Report transaction effects if available
      signedTx.reportTransactionEffects?.(executeResult.rawEffects as any);
    } catch (error) {
      console.error('Transaction Error:', error);
    }
  };

  return (
    <main>
      <button onClick={handleTransaction}>Mint Token</button>
      <ConnectButton />
      {account && (
        <>
          <div>Connected to {account.address}</div>
          <OwnedObjects address={account.address} />
        </>
      )}
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
