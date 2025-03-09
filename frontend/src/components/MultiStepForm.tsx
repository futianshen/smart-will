import {
    Box,
    Button,
    HStack,
    Input,
    Textarea,
    VStack,
} from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import {
    StepsCompletedContent,
    StepsContent,
    StepsItem,
    StepsList,
    StepsNextTrigger,
    StepsPrevTrigger,
    StepsRoot,
} from './ui/steps';
import { useState } from 'react';

type Recipient = { address: string; percentage: number };

const MultiStepForm = () => {
    const { theme } = useTheme(); // 動態偵測主題模式

    // 🎨 讓背景與 ParticlesBg 保持一致
    const bgColor = theme === 'dark' ? '#0d0d0d' : '#ffffff';
    const textColor = theme === 'dark' ? '#ffffff' : '#0d0d0d';
    const inputBg = theme === 'dark' ? '#1a1a1a' : '#f0f0f0';
    const buttonColor = '#00bcd4'; // Sui 藍色

    const [recipients, setRecipients] = useState<Recipient[]>([
        { address: '', percentage: 0 },
    ]);

    const addRecipient = () => {
        setRecipients([...recipients, { address: '', percentage: 0 }]);
    };

    const removeRecipient = (index: number) => {
        setRecipients(recipients.filter((_, i) => i !== index));
    };

    const handleRecipientChange = (index: number, field: keyof Recipient, value: string | number) => {
        setRecipients(
            recipients.map((recipient, i) =>
                i === index ? { ...recipient, [field]: value } : recipient
            )
        );
    };

    return (
        <Box
            maxW="600px"
            mx="auto"
            mt={10}
            p={6}
            bg={bgColor}
            color={textColor}
            borderRadius="md"
            boxShadow="xl"
            border="1px solid"
            borderColor={theme === 'dark' ? '#222' : '#ddd'}
        >
            <StepsRoot defaultStep={0} count={3}>
                <StepsList mb={8}>
                    <StepsItem index={0} title="Will" />
                    <StepsItem index={1} title="Give" />
                    <StepsItem index={2} title="Send" />
                </StepsList>

                <StepsContent index={0}>
                    <VStack align="stretch" >
                        <Textarea
                            placeholder="Your final message or wishes..."
                            bg={inputBg}
                            border="1px solid"
                            borderColor={theme === 'dark' ? '#444' : '#ccc'}
                            _focus={{ borderColor: buttonColor }}
                        />
                    </VStack>
                </StepsContent>

                <StepsContent index={1}>
                    <VStack align="stretch">
                        {recipients.map((recipient, index) => (
                            <HStack key={index} >
                                <Input
                                    placeholder="Recipient Address (0x...)"
                                    value={recipient.address}
                                    onChange={(e) => handleRecipientChange(index, 'address', e.target.value)}
                                    bg={inputBg}
                                    border="1px solid"
                                    borderColor={theme === 'dark' ? '#444' : '#ccc'}
                                    _focus={{ borderColor: buttonColor }}
                                />
                                <Input
                                    type="number"
                                    placeholder="Percentage (%)"
                                    value={recipient.percentage}
                                    onChange={(e) => handleRecipientChange(index, 'percentage', Number(e.target.value))}
                                    bg={inputBg}
                                    border="1px solid"
                                    width={"100px"}
                                    borderColor={theme === 'dark' ? '#444' : '#ccc'}
                                    _focus={{ borderColor: buttonColor }}
                                />
                                <Button
                                    variant="outline"
                                    colorScheme="red"
                                    onClick={() => removeRecipient(index)}
                                    disabled={recipients.length === 1}
                                >
                                    -
                                </Button>
                            </HStack>
                        ))}
                        <Button variant="solid" bg={buttonColor} color="white" _hover={{ bg: '#0097a7' }} onClick={addRecipient}>
                            + Add Recipient
                        </Button>
                    </VStack>
                </StepsContent>

                <StepsContent index={2}>
                    <VStack align="stretch" >
                        <Input
                            placeholder="Generated contract address..."
                            bg={inputBg}
                            border="1px solid"
                            borderColor={theme === 'dark' ? '#444' : '#ccc'}
                            value="0x1234...abcd" // Example contract address
                        />
                        <Input
                            type="number"
                            placeholder="Enter amount to transfer..."
                            bg={inputBg}
                            border="1px solid"
                            borderColor={theme === 'dark' ? '#444' : '#ccc'}
                            _focus={{ borderColor: buttonColor }}
                        />
                    </VStack>
                </StepsContent>

                <StepsCompletedContent>
                    <p>All steps are complete!</p>
                </StepsCompletedContent>

                <HStack justify="space-between" mt={4}>
                    <StepsPrevTrigger asChild>
                        <Button variant="outline" color={buttonColor} borderColor={buttonColor}>
                            Previous
                        </Button>
                    </StepsPrevTrigger>
                    <StepsNextTrigger asChild>
                        <Button variant="solid" bg={buttonColor} color="white" _hover={{ bg: '#0097a7' }}>
                            Next
                        </Button>
                    </StepsNextTrigger>
                </HStack>
            </StepsRoot>
        </Box>
    );
};

export default MultiStepForm;
