import ParticlesBg from "@/components/ParticlesBg";
import { useSmartWill } from "@/useSmartWill";
import { Button, Heading, Input, VStack } from "@chakra-ui/react";
import { useState } from "react";

const CreateWillPage = ({ setPage }: { setPage: (page: "landing" | "dashboard" | "create-will") => void; }) => {
    const { createWill } = useSmartWill()
    const [custodian, setCustodian] = useState("");
    const [recipients, setRecipients] = useState("");
    const [proportions, setProportions] = useState("");
    const [interval, setInterval] = useState("");


    const handleSubmit = async () => {
        try {
            const recipientArray = recipients.split(",").map((r) => r.trim());
            const proportionArray = proportions.split(",").map((p) => Number(p.trim()));

            await createWill(custodian, recipientArray, proportionArray, Number(interval));

            setPage("dashboard");
        } catch (error) {

        }
    };

    return (
        <VStack align="start">
            <ParticlesBg />
            <button onClick={() => createWill("0xCustodianAddress", ["0xRecipient1", "0xRecipient2"], [50, 50], 12)}>創建遺囑</button>
            <Heading size="md">Create a Will</Heading>
            <Input placeholder="Custodian Address" value={custodian} onChange={(e) => setCustodian(e.target.value)} />
            <Input placeholder="Recipients (comma separated)" value={recipients} onChange={(e) => setRecipients(e.target.value)} />
            <Input placeholder="Proportions (comma separated)" value={proportions} onChange={(e) => setProportions(e.target.value)} />
            <Input placeholder="Interval (Months)" value={interval} onChange={(e) => setInterval(e.target.value)} />
            <Button colorScheme="blue" onClick={handleSubmit}>
                Submit
            </Button>
        </VStack>
    );
};

export default CreateWillPage;
