import { Button, Center, Text } from "@chakra-ui/react";
import { standardSignMessage } from "~/web3/wallet-connect";

export default function LensAuth() {
  const handleSignChallengeText = async () => {
    await standardSignMessage();
  };

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
