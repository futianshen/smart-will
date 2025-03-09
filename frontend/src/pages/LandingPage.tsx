import ParticlesBg from "@/components/ParticlesBg";
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { ConnectButton, useCurrentWallet } from "@mysten/dapp-kit";
import { motion } from "framer-motion";
import { useEffect } from "react";

const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionButton = motion(Button);

const LandingPage = ({ setPage }: { setPage: (page: "landing" | "dashboard" | "create-will") => void }) => {
    const { connectionStatus } = useCurrentWallet();

    useEffect(() => {
        if (connectionStatus === "connected") {
            setPage("dashboard");
        }
    }, [connectionStatus]);

    return (
        <Box position="relative" w="100%" >
            <ParticlesBg />
            <VStack
                justify="center"
                align="center"
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                textAlign="center"
                zIndex={2}
                color="white"
            >
                <MotionHeading
                    fontSize="4xl"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    textShadow="0 0 20px rgba(255,255,255,0.5)"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    width={"6000px"}
                >
                    Sui Smart Will
                </MotionHeading>
                <MotionText
                    fontSize="lg"
                    maxW="lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    Secure your digital assets for the future with decentralized wills.
                </MotionText>
                <MotionButton
                    as={ConnectButton}
                    size="lg"
                    variant="outline"
                    border="2px solid white"
                    _hover={{
                        bg: "white",
                        color: "black",
                        boxShadow: "0 0 20px rgba(255,255,255,0.8)",
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                />
            </VStack>
        </Box>
    );
};

export default LandingPage;
