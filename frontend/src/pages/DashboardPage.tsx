import ParticlesBg from "@/components/ParticlesBg";
import { useSmartWill } from "@/useSmartWill";
import { Button, Heading, List, Link, ListItem, Text, VStack } from "@chakra-ui/react";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";

const DashboardPage = ({ setPage }: { setPage: (page: "landing" | "dashboard" | "create-will") => void }) => {
    const account = useCurrentAccount();
    const { data } = useSuiClientQuery("getOwnedObjects", { owner: account?.address || "" });

    const { renewLife, executeDistribution } = useSmartWill();

    return (
        <VStack align="start">
            <ParticlesBg />
            <Heading size="md">Your Wills</Heading>
            <button onClick={() => renewLife("0xWILL_OBJECT_ID")}>更新存活狀態</button>
            <>
                {data?.data.length ? (
                    <List.Root>
                        {data.data.map((object) => (
                            <ListItem key={object.data?.objectId}>
                                <Link href={`https://suiscan.xyz/testnet/object/${object.data?.objectId}/tx-blocks`} isExternal>
                                    {object.data?.objectId}
                                </Link>
                                <button onClick={() => executeDistribution("0xWILL_OBJECT_ID")}>執行分配</button>
                            </ListItem>
                        ))}
                    </List.Root>
                ) : (
                    <Text>No wills found.</Text>
                )}</>
            <Button colorScheme="blue" onClick={() => setPage("create-will")}>
                Create a Will
            </Button>
        </VStack>
    );
};

export default DashboardPage;
