import React, { useState, FormEvent } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  Container,
  useToast,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { FaWhatsapp, FaUtensils } from 'react-icons/fa';

// Animation keyframes
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(5deg); }
  50% { transform: translateY(-10px) rotate(-5deg); }
  75% { transform: translateY(-15px) rotate(3deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`;

const App: React.FC = () => {
  const [whatsappLink, setWhatsappLink] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!whatsappLink.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a WhatsApp invite link',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!whatsappLink.includes('whatsapp.com')) {
      toast({
        title: 'Invalid Link',
        description: 'Please enter a valid WhatsApp invite link',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const body = JSON.stringify({
        inviteLink: whatsappLink
      });
      console.log(body)
      const response = await fetch('http://108.61.252.153:3001/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Success!',
          description: data.message || 'Your WhatsApp link has been submitted successfully!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setWhatsappLink('');
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: 'Error',
          description: errorData.message || `Server error: ${response.status}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('API call failed:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to the server. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      position="relative"
      overflow="hidden"
      bgGradient="linear(135deg, #22c55e 0%, #16a34a 25%, #15803d 50%, #166534 75%, #14532d 100%)"
      backgroundSize="400% 400%"
      animation={`${gradientShift} 15s ease infinite`}
    >
      {/* Animated Background Elements */}
      <Box
        position="absolute"
        top="10%"
        left="10%"
        w="20px"
        h="20px"
        bg="rgba(255, 255, 255, 0.3)"
        borderRadius="50%"
        animation={`${float} 6s ease-in-out infinite`}
        _hover={{ transform: 'scale(1.5)', bg: 'rgba(255, 255, 255, 0.6)' }}
        transition="all 0.3s ease"
      />

      <Box
        position="absolute"
        top="20%"
        right="15%"
        w="15px"
        h="15px"
        bg="rgba(255, 255, 255, 0.4)"
        borderRadius="50%"
        animation={`${float} 8s ease-in-out infinite 2s`}
        _hover={{ transform: 'scale(1.3)', bg: 'rgba(255, 255, 255, 0.7)' }}
        transition="all 0.3s ease"
      />

      <Box
        position="absolute"
        bottom="30%"
        left="20%"
        w="25px"
        h="25px"
        bg="rgba(255, 255, 255, 0.2)"
        borderRadius="50%"
        animation={`${float} 7s ease-in-out infinite 1s`}
        _hover={{ transform: 'scale(1.4)', bg: 'rgba(255, 255, 255, 0.5)' }}
        transition="all 0.3s ease"
      />

      <Box
        position="absolute"
        bottom="20%"
        right="25%"
        w="18px"
        h="18px"
        bg="rgba(255, 255, 255, 0.3)"
        borderRadius="50%"
        animation={`${float} 9s ease-in-out infinite 3s`}
        _hover={{ transform: 'scale(1.6)', bg: 'rgba(255, 255, 255, 0.6)' }}
        transition="all 0.3s ease"
      />

      {/* Main Content */}
      <Box position="relative" zIndex="2">
        <Container maxW="container.md" py={20}>
          <VStack spacing={12} textAlign="center">
            {/* Header Section */}
            <VStack spacing={6}>
              <Heading
                as="h1"
                size="2xl"
                color="white"
                fontWeight="bold"
                textShadow="2px 2px 4px rgba(0,0,0,0.3)"
                animation={`${pulse} 3s ease-in-out infinite`}
              >
                Nomi
              </Heading>
              <Text
                fontSize="l"
                color="white"
                maxW="md"
                textShadow="1px 1px 2px rgba(0,0,0,0.3)"
                _hover={{ transform: 'scale(1.02)', transition: 'transform 0.3s ease' }}
              >
                Plan dinner parties, road trips, and fridge-fueled cook-offs right in the comfort of your WhatsApp
              </Text>
            </VStack>

            {/* Main Form Section */}
            <Box
              bg="rgba(255, 255, 255, 0.95)"
              backdropFilter="blur(10px)"
              p={8}
              borderRadius="xl"
              boxShadow="xl"
              w="full"
              maxW="md"
              border="1px solid rgba(255, 255, 255, 0.2)"
              _hover={{
                transform: 'translateY(-5px)',
                boxShadow: '2xl',
                transition: 'all 0.3s ease'
              }}
            >
              <VStack spacing={6}>
                <Flex align="center" gap={2}>
                  <Icon
                    as={FaWhatsapp}
                    w={6}
                    h={6}
                    color="green.500"
                    animation={`${pulse} 2s ease-in-out infinite`}
                  />
                  <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                    Invite Nomi to your chat!
                  </Text>
                </Flex>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                  <VStack spacing={4} w="full">
                    <Input
                      placeholder="Enter WhatsApp invite link..."
                      value={whatsappLink}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWhatsappLink(e.target.value)}
                      size="lg"
                      borderRadius="lg"
                      border="2px"
                      borderColor="gray.200"
                      bg="white"
                      _focus={{
                        borderColor: 'brand.500',
                        boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                        transform: 'scale(1.02)',
                      }}
                      _hover={{
                        borderColor: 'gray.300',
                        transform: 'scale(1.01)',
                      }}
                      transition="all 0.3s ease"
                    />

                    <Button
                      type="submit"
                      colorScheme="brand"
                      size="lg"
                      w="full"
                      borderRadius="lg"
                      isLoading={isLoading}
                      loadingText="Submitting..."
                      _hover={{
                        transform: 'translateY(-3px) scale(1.02)',
                        boxShadow: 'lg',
                      }}
                      _active={{
                        transform: 'translateY(-1px) scale(1.01)',
                      }}
                      transition="all 0.2s ease"
                    >
                      Join Community
                    </Button>
                  </VStack>
                </form>
              </VStack>
            </Box>

            {/* Footer Section */}
            <VStack spacing={4}>
              <Text
                fontSize="sm"
                color="white"
                textShadow="1px 1px 2px rgba(0,0,0,0.3)"
                _hover={{ transform: 'scale(1.05)', transition: 'transform 0.3s ease' }}
              >
                Reclaim your time arguing with friends about food
              </Text>
              <Text
                fontSize="xs"
                color="rgba(255,255,255,0.8)"
                textShadow="1px 1px 2px rgba(0,0,0,0.3)"
                _hover={{ color: 'white', transition: 'color 0.3s ease' }}
              >
                Smart grocery lists • Easy Shopping • Save time & money
              </Text>
            </VStack>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default App;
