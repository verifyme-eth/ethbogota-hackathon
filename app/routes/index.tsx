// BFF elements
import type { LoaderFunction } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useSubmit,
  useTransition,
} from "@remix-run/react";

import { db } from "~/utils/db.server";

import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

import { subscribeToEvents } from "~/web3/wallet-connect";

// UI elements
import {
  Box,
  Button,
  Center,
  Hide,
  HStack,
  Icon,
  Image,
  Img,
  Text,
} from "@chakra-ui/react";

import { AiFillCheckCircle } from "react-icons/ai";
import { MdVisibility } from "react-icons/md";
import { BsPlusLg } from "react-icons/bs";

// Components
import { Landing } from "~/components/LandingDesktop";
import Footer from "~/components/FooterApp";

export const loader: LoaderFunction = async () => {
  // Get the number of verified users
  const verifiedUser = await db.verified.count();

  return verifiedUser;
};

export default function Index() {
  const verifiedUser = useLoaderData();
  const submit = useSubmit();
  const transition = useTransition();

  const handleLoginWalletConnect = async () => {
    console.log(
      "[browser][handleLoginWalletConnect] Waiting connection with walletConnect ..."
    );

    // bridge url
    const bridge = "https://bridge.walletconnect.org";

    // create new connector
    const connector: WalletConnect = new WalletConnect({
      bridge, // Required
      qrcodeModal: QRCodeModal,
    });

    // check if already connected
    if (!connector.connected) {
      console.log("[browser][handleLoginWalletConnect] Creating session ...");
      // create new session
      await connector.createSession();
    } else {
      console.log("[browser][handleLoginWalletConnect] connector:", connector);

      const address = connector.accounts[0];

      console.log("[browser][handleLoginWalletConnect] address:", address);

      const formData = new FormData();

      formData.append("address", address);
      formData.append("connected", "true");

      submit(formData, {
        action: "/login/?index",
        method: "post",
        encType: "application/x-www-form-urlencoded",
        replace: true,
      });
    }

    // subscribe to events and submit form
    subscribeToEvents(connector, submit);
  };

  return (
    <>
      <Hide above="sm">
        <Center mt="5">
          <Img src="./assets/verify-me.png" w={24} h={24} />
        </Center>

        <Center>
          <Box
            bg={"white"}
            borderRadius={15}
            height={["300px", "356px", "356px"]}
            width={["80%", "80%", "500px"]}
          >
            <Center margin={5}>
              <Text
                textAlign="center"
                fontWeight={700}
                fontSize={"25"}
                lineHeight={"30px"}
              >
                Social verification in{" "}
                <Text as="span" color="lensDark">
                  Lens Protocol
                </Text>{" "}
                with{" "}
                <Text as="span" color="poap">
                  POAPs
                </Text>
              </Text>
            </Center>

            {transition.state === "idle" && (
              <>
                <Center mt="5">
                  <HStack>
                    <Img src="./assets/poap-logo.png" w={14} />

                    <Icon as={BsPlusLg} color="lensDark" />

                    <Img src="./assets/lens-logo.png" w={14} />
                  </HStack>
                </Center>

                <Center mt="12">
                  <Box
                    width={"100%"}
                    borderRadius={20}
                    boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
                  >
                    <Center paddingTop={5}>
                      <Link to="/login">
                        <Button
                          bgGradient="linear(to-l, poapDark, pink.500)"
                          color="white"
                          borderRadius={"70px"}
                          boxShadow="0px 2px 3px rgba(0, 0, 0, 0.15)"
                          onClick={handleLoginWalletConnect}
                        >
                          <Text
                            fontWeight={500}
                            fontSize={"18px"}
                            lineHeight={"21.6px"}
                          >
                            Connect your wallet
                          </Text>
                        </Button>
                      </Link>
                    </Center>

                    <HStack margin={"auto"} paddingTop={5}>
                      <Icon
                        as={MdVisibility}
                        margin={5}
                        color="poapDark"
                        w={8}
                        h={8}
                      />

                      <Text
                        color={"grayLetter"}
                        fontSize={"14"}
                        paddingRight={5}
                      >
                        View only permission. We will never do anything withot
                        your approval
                      </Text>
                    </HStack>

                    <HStack>
                      <Icon
                        as={AiFillCheckCircle}
                        margin={5}
                        color="lensDark"
                        w={8}
                        h={8}
                      />

                      <Text color={"grayLetter"} fontSize={"14"}>
                        There are currently{" "}
                        <Text
                          as="span"
                          bgGradient="linear(to-l, gradient1, gradient2)"
                          bgClip="text"
                          fontWeight="bold"
                        >
                          {verifiedUser}{" "}
                        </Text>
                        frens verifying in Lens, join us!
                      </Text>
                    </HStack>
                  </Box>
                </Center>
              </>
            )}

            {transition.state === "loading" && (
              <Box>
                <Text textAlign="center" fontSize="26px" color="lensDark">
                  Connecting with garden
                </Text>

                <Center>
                  <Box mt="20px">
                    <Image src="./assets/lens-loading.gif" rounded="2xl" />
                  </Box>
                </Center>
              </Box>
            )}

            {/* <MobileConnectWalletModal isOpen={isOpen} onClose={onClose} /> */}
          </Box>
        </Center>
        <Footer />
      </Hide>

      <Hide below="sm">
        <Landing />
      </Hide>
    </>
  );
}
