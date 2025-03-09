import { Heading, Text, VStack } from "@chakra-ui/react";
import { ConnectButton, useCurrentWallet } from "@mysten/dapp-kit";
import { useEffect } from "react";

const LandingPage = ({ setPage }: { setPage: (page: "landing" | "dashboard" | "create-will") => void }) => {
    const { connectionStatus } = useCurrentWallet();

    useEffect(() => {
        if (connectionStatus == 'connected') {
            setPage('dashboard')
        }
    }, [connectionStatus])

    return (
        <VStack>
            <Heading>Welcome to Sui Smart Will</Heading>
            <Text>Manage your digital assets with on-chain wills</Text>
            <ConnectButton />
        </VStack>
    );
};

export default LandingPage;
