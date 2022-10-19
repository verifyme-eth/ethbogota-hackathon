import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

import { personalSignMessage } from "~/web3/wallet-connect";

import { Button, Center, Text } from "@chakra-ui/react";
import { useSubmit } from "@remix-run/react";

type LensAuthProps = {
  address: string;
  challengeText: string;
};

export default function LensAuth({ address, challengeText }: LensAuthProps) {
  const submit = useSubmit();

  const handleSignChallengeText = async () => {
    // bridge url
    const bridge = "https://bridge.walletconnect.org";

    // create new connector
    const connector: WalletConnect = new WalletConnect({
      bridge, // Required
      qrcodeModal: QRCodeModal,
    });

    const formatedResult = await personalSignMessage(
      connector,
      address,
      challengeText
    );

    const formData = new FormData();

    formData.append("signature", formatedResult?.signature);

    submit(formData, {
      action: "/auth/?index",
      method: "post",
      encType: "application/x-www-form-urlencoded",
      replace: true,
    });
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
