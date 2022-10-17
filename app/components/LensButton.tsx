import { Button, Center, Text } from "@chakra-ui/react";

export default function LensAuth() {
  return (
    <Center mt="10px">
      <Button borderRadius="50" bg="lens">
        <Text fontSize="16px" fontWeight="bold" color="lensDark">
          Sign in with Lens
        </Text>
      </Button>
    </Center>
  );
}
