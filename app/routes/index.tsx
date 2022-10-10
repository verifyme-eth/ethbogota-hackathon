import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Box, Button, Center, HStack, Text } from "@chakra-ui/react";

import { Landing } from "~/components/LandingDesktop";

export const loader: LoaderFunction = () => {
  const verifiedUser = 5;

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
          {/* <Box marginTop={10}>
          <Center>
            <WalletIcon width={80} height={80} />
          </Center>
        </Box> */}

          <Center margin={5}>
            <Text
              fontWeight={700}
              fontSize={"22"}
              letterSpacing={"5px"}
              lineHeight={"26.4px"}
            >
              titulo
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
                <Button
                  bg={"primary"}
                  color="white"
                  borderRadius={70}
                  display={["block", "none", "none"]}
                  // onClick={onOpen}
                >
                  <Text
                    fontWeight={400}
                    fontSize={"18px"}
                    lineHeight={"21.6px"}
                  >
                    {/* {t("button")} */}
                    button
                  </Text>
                </Button>

                <Button
                  bg={"primary"}
                  color="white"
                  borderRadius={70}
                  display={["none", "block", "block"]}
                  // onClick={login}
                >
                  <Text
                    fontWeight={400}
                    fontSize={"18px"}
                    lineHeight={"21.6px"}
                  >
                    {/* {t("button")} */}
                    button
                  </Text>
                </Button>
              </Center>

              <HStack margin={"auto"} paddingTop={5}>
                {/* <Icon as={VisibilityIcon} margin={5} color="sixth" /> */}

                <Text color={"grayLetter"} fontSize={"14"} paddingRight={2}>
                  {/* {t("permission")} */}
                  permisos
                </Text>
              </HStack>

              <HStack>
                {/* <Icon as={FavoriteIcon} margin={5} color="sixth" /> */}

                <Text color={"grayLetter"} fontSize={"14"}>
                  {/* {t("trustedBy")} {users} {t("users")} */}
                  Verified user: {verifiedUser}
                </Text>
              </HStack>

              <HStack>
                {/* <Icon as={VerifiedUserIcon} margin={5} color="sixth" /> */}

                <Text color={"grayLetter"} fontSize={"14"}>
                  {/* {t("verified")} */}
                  verificados
                </Text>
              </HStack>
            </Box>
          </Center>

          {/* <MobileConnectWalletModal isOpen={isOpen} onClose={onClose} /> */}
        </Box>
      </Center>
      <Landing />;
    </>
  );
}
