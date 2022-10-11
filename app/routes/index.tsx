// BFF elements
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { db } from "~/utils/db.server";

// UI elements
import {
  Box,
  Button,
  Center,
  Hide,
  HStack,
  Icon,
  Img,
  Text,
} from "@chakra-ui/react";

import { AiFillCheckCircle } from "react-icons/ai";
import { MdVisibility } from "react-icons/md";

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

  return (
    <>
      <Hide above="sm">
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
                fontSize={"28"}
                lineHeight={"34.13px"}
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

            <Center mt="10">
              <HStack>
                <Img src="./assets/poap-logo.png" />

                <Img src="./assets/lens-logo.png" />
              </HStack>
            </Center>

            <Center marginTop={20}>
              <Box
                width={"100%"}
                borderRadius={20}
                boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
              >
                <Center paddingTop={5}>
                  <Link to="/login">
                    <Button bg="lensDark" color="white" borderRadius={70}>
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

                  <Text color={"grayLetter"} fontSize={"14"} paddingRight={2}>
                    There are currently {verifiedUser} frens verifying in Lens,
                    join us!
                  </Text>
                </HStack>
              </Box>
            </Center>

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
