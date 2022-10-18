import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

import { personalSignMessage } from "~/web3/wallet-connect";

import { Button, Center, Text } from "@chakra-ui/react";

type LensAuthProps = {
  address: string;
  challengeText: string;
};

export default function LensAuth({ address, challengeText }: LensAuthProps) {
  const handleSignChallengeText = async () => {
    // bridge url
    const bridge = "https://bridge.walletconnect.org";

    // create new connector
    const connector: WalletConnect = new WalletConnect({
      bridge, // Required
      qrcodeModal: QRCodeModal,
    });

    await personalSignMessage(connector, address, challengeText);
  };

  return (
    <Center mt="10px">
      <Button borderRadius="50" bg="lens" onClick={handleSignChallengeText}>
        <Text fontSize="16px" fontWeight="bold" color="lensDark">
          Sign in with Lens
        </Text>
      </Button>
    </Center>
  );
}
