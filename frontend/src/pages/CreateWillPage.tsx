import MultiStepForm from "@/components/MultiStepForm";
import ParticlesBg from "@/components/ParticlesBg";
import { useSmartWill } from "@/useSmartWill";
import { VStack } from "@chakra-ui/react";

const CreateWillPage = ({ setPage }: { setPage: (page: "landing" | "dashboard" | "create-will") => void; }) => {
    const { createWill } = useSmartWill()

    return (
        <VStack align="start">
            <ParticlesBg />
            <MultiStepForm />
        </VStack>
    );
};

export default CreateWillPage;
