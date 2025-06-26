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
import { FaWhatsapp, FaUtensils } from 'react-icons/fa';

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
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.md" py={20}>
        <VStack spacing={12} textAlign="center">
          {/* Header Section */}
          <VStack spacing={6}>
            <Flex align="center" gap={3}>
              <Icon as={FaUtensils} w={12} h={12} color="brand.500" />
              <Heading
                as="h1"
                size="2xl"
                bgGradient="linear(to-r, brand.500, brand.600)"
                bgClip="text"
                fontWeight="bold"
              >
                Food Journey
              </Heading>
            </Flex>
            <Text fontSize="xl" color="gray.600" maxW="md">
              Join our vibrant community of food lovers and discover amazing recipes,
              restaurant recommendations, and culinary adventures together!
            </Text>
          </VStack>

          {/* Main Form Section */}
          <Box
            bg="white"
            p={8}
            borderRadius="xl"
            boxShadow="xl"
            w="full"
            maxW="md"
          >
            <VStack spacing={6}>
              <Flex align="center" gap={2}>
                <Icon as={FaWhatsapp} w={6} h={6} color="green.500" />
                <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                  Join Our WhatsApp Community
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
                    _focus={{
                      borderColor: 'brand.500',
                      boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                    }}
                    _hover={{
                      borderColor: 'gray.300',
                    }}
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
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                    }}
                    transition="all 0.2s"
                  >
                    Join Community
                  </Button>
                </VStack>
              </form>
            </VStack>
          </Box>

          {/* Footer Section */}
          <VStack spacing={4}>
            <Text fontSize="sm" color="gray.500">
              Connect with fellow food enthusiasts
            </Text>
            <Text fontSize="xs" color="gray.400">
              Share recipes • Discover restaurants • Plan food adventures
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default App;
