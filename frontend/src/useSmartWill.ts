import { useSuiClient, useSignTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

const PACKAGE_ID = "0x200ab82b1ecb6b9f2ba5d5b79989d317c5d84d5ba8851ce093e7f8d87b64c7e0";
const MODULE_NAME = "will_contract";

export const useSmartWill = () => {
    const account = useCurrentAccount();
    const client = useSuiClient();
    const { mutateAsync: signTransaction } = useSignTransaction();

    const sendTransaction = async (transaction: Transaction, gasBudget: number) => {
        try {
            transaction.setGasBudget(gasBudget);
            const signedTx = await signTransaction({ transaction, chain: 'sui:testnet' });
            const executeResult = await client.executeTransactionBlock({
                transactionBlock: signedTx.bytes,
                signature: signedTx.signature,
                options: { showRawEffects: true },
            });
            console.log('Transaction Execution Result:', executeResult);
            return executeResult;
        } catch (error) {
            console.error('Transaction Error:', error);
            throw error;
        }
    };

    const createWill = async (custodian: string, recipients: string[], proportions: number[], intervalMonths: number) => {
        if (!account) throw new Error("請先連接錢包");
        const transaction = new Transaction();
        transaction.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::create_will`,
            arguments: [
                transaction.pure(account.address, "address"),
                transaction.pure(custodian, "address"),
                transaction.pure(recipients, "vector<address>"),
                transaction.pure(proportions, "vector<u64>"),
                transaction.pure(intervalMonths, "u64")
            ],
        });
        return sendTransaction(transaction, 300000000);
    };

    const renewLife = async (willObjectId: string) => {
        if (!account) throw new Error("請先連接錢包");
        const transaction = new Transaction();
        transaction.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::renew_life`,
            arguments: [transaction.object(willObjectId)],
        });
        return sendTransaction(transaction, 200000000);
    };

    const executeDistribution = async (willObjectId: string) => {
        if (!account) throw new Error("請先連接錢包");
        const transaction = new Transaction();
        transaction.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::execute_distribution`,
            arguments: [transaction.object(willObjectId)],
        });
        return sendTransaction(transaction, 500000000);
    };

    return { createWill, renewLife, executeDistribution };
};
