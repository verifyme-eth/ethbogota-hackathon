// BFF elements
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { db } from "~/utils/db.server";

// UI elements
import { Box, Button, Center, HStack, Icon, Text } from "@chakra-ui/react";

import { Landing } from "~/components/LandingDesktop";

import { AiFillCheckCircle } from "react-icons/ai";
import { MdVisibility } from "react-icons/md";
import { FaWallet } from "react-icons/fa";

export const loader: LoaderFunction = async () => {
  // Get the number of verified users
  const verifiedUser = await db.verified.count();

  return verifiedUser;
};

export default function Index() {
  const verifiedUser = useLoaderData();

  return (
    <>
      <Center display={["block", "none", "none", "none"]}>
        <Box
          bg={"white"}
          borderRadius={15}
          height={["300px", "356px", "356px"]}
          width={["80%", "80%", "500px"]}
          marginTop={[10, 40, 40]}
        >
          <Box marginTop={10}>
            <Center>
              <FaWallet width={80} height={80} />
            </Center>
          </Box>

          <Center margin={5}>
            <Text
              fontWeight={700}
              fontSize={"22"}
              letterSpacing={"5px"}
              lineHeight={"26.4px"}
            >
              Social verification in Lens with POAPs
            </Text>
          </Center>

          <Center margin={5}>
            <Text
              fontWeight={400}
              fontSize={"18"}
              lineHeight={"21.6px"}
              color="grayLetter"
              textAlign={"center"}
            >
              subtitulo
            </Text>
          </Center>

          <Center marginTop={5}>
            <Box
              width={"100%"}
              borderRadius={20}
              boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
            >
              <Center paddingTop={5}>
                <Link to="/login">
                  <Button bg={"first"} color="white" borderRadius={70}>
                    <Text
                      fontWeight={400}
                      fontSize={"18px"}
                      lineHeight={"21.6px"}
                    >
                      Connect your wallet
                    </Text>
                  </Button>
                </Link>
              </Center>

              <HStack margin={"auto"} paddingTop={5}>
                <Icon as={MdVisibility} margin={5} color="sixth" />

                <Text color={"grayLetter"} fontSize={"14"} paddingRight={2}>
                  View only permission. We will never do anything withot your
                  approval
                </Text>
              </HStack>

              <HStack>
                <Icon as={AiFillCheckCircle} margin={5} color="sixth" />

                <Text color={"grayLetter"} fontSize={"14"}>
                  We have {verifiedUser} verified users
                </Text>
              </HStack>
            </Box>
          </Center>

          {/* <MobileConnectWalletModal isOpen={isOpen} onClose={onClose} /> */}
        </Box>
      </Center>

      <Landing />
    </>
  );
}
