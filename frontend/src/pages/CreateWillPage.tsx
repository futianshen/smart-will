import MultiStepForm from "@/components/MultiStepForm";
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
            <MultiStepForm />
        </VStack>
    );
};

export default CreateWillPage;
