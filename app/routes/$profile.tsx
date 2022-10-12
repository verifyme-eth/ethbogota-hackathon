import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import {
  Link,
  useLoaderData,
  useSubmit,
  useTransition,
} from "@remix-run/react";

import { AiFillHome } from "react-icons/ai";

import { GraphQLClient } from "graphql-request";

import { GetProfile } from "~/web3/lens";
import { comparePoaps } from "~/web3/poap";
import { transformToIpfsUrl } from "~/web3/ipfs";

import { db } from "~/utils/db.server";

import { getSession } from "~/bff/session";

import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Text,
  CircularProgress,
  Img,
  HStack,
  Divider,
  Icon,
  Image,
} from "@chakra-ui/react";

import PoapContainer from "~/components/PoapContainer";

export const loader: LoaderFunction = async ({ params, request }) => {
  // Get address from cookie session
  const session = await getSession(request.headers.get("Cookie"));

  const address = session.get("address");

  // Get profile from Lens protocol
  const lens = new GraphQLClient("https://api.lens.dev/playground");

  const variables = {
    request: { handle: params.profile },
  };

  const response = await lens.request(GetProfile, variables);

  const userProfile = response.profile;

  // Get poaps shared
  const { common, arrLength, arrDiff } = await comparePoaps(
    address,
    userProfile.ownedBy
  );

  // Get if user is verified
  const verified = await db.verified.findUnique({
    where: {
      address: userProfile.ownedBy.toLowerCase(),
    },
  });

  let indexVm = 0;

  let verifiedForUser = false;

  if (verified) {
    const verifiers = JSON.parse(verified?.poaps as string);

    const verifiersWallet = Object.keys(verifiers);

    // Check if verifiers wallet is the same as the user wallet
    for (let i = 0; i < verifiersWallet.length; i++) {
      if (verifiersWallet[i] == address) {
        verifiedForUser = true;
      }
    }

    for (let address in verifiers) {
      indexVm += JSON.parse(verifiers[address]).length;
    }
  } else {
    indexVm = 0;
    verifiedForUser = false;
  }

  return {
    userProfile,
    address,
    common,
    arrLength,
    arrDiff,
    indexVm,
    verifiedForUser,
  };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const address = form.get("address");
  const profileAddress = form.get("profileAddress");
  const poaps = form.get("poaps");
  const intent = form.get("intent");

  if (!address || typeof address !== "string") return null;
  if (!profileAddress || typeof profileAddress !== "string") return null;
  if (!poaps || typeof poaps !== "string") return null;
  if (!intent || typeof intent !== "string") return null;

  if (intent == "verify") {
    const verified = await db.verified.findUnique({
      where: {
        address: profileAddress.toLowerCase(),
      },
    });

    if (verified) {
      const verifiers = JSON.parse(verified?.poaps as string);

      verifiers[address] = poaps;

      await db.verified.update({
        where: {
          address: profileAddress.toLowerCase(),
        },
        data: {
          poaps: JSON.stringify(verifiers),
        },
      });
    } else {
      const poapsVerified = {
        [address]: poaps,
      };

      await db.verified.create({
        data: {
          address: profileAddress.toLowerCase(),
          poaps: JSON.stringify(poapsVerified),
        },
      });
    }
  }

  //remove the last / from string
  const url = request.url.slice(0, -1);

  return redirect(url);
};

export default function Profile() {
  const {
    userProfile,
    address,
    common,
    arrLength,
    arrDiff,
    indexVm,
    verifiedForUser,
  } = useLoaderData();

  const submit = useSubmit();

  const transition = useTransition();

  const handleVerify = async () => {
    const formData = new FormData();

    const poaps = common.map((poap: any) => poap.id);

    formData.append("address", address);
    formData.append("profileAddress", userProfile.ownedBy);
    formData.append("poaps", `[${poaps}]`);
    formData.append("intent", "verify");

    submit(formData, {
      action: `${userProfile.handle}/?index`,
      method: "post",
      encType: "application/x-www-form-urlencoded",
      // replace: true,
    });
  };

  return (
    <Box pt="20px">
      {transition.state === "idle" && (
        <>
          <Box>
            <Center mt="60px">
              <Flex mt="-60px">
                <Box mt="70px" mr="20px">
                  <Text
                    textAlign="center"
                    fontSize="24px"
                    fontWeight="bold"
                    color="black"
                  >
                    {userProfile.stats.totalFollowers}
                  </Text>
                  <Text fontSize="16px" fontWeight="bold" color="#6F6F6F">
                    Followers
                  </Text>
                </Box>

                <Box position="relative" display="inline-flex">
                  <CircularProgress
                    value={indexVm}
                    size="150px"
                    color="gradient1"
                    thickness="8px"
                  />

                  <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {userProfile.picture?.original && (
                      <Avatar
                        size="xl"
                        src={transformToIpfsUrl(
                          userProfile.picture?.original?.url
                        )}
                      />
                    )}

                    {userProfile.picture?.uri && (
                      <Avatar
                        size="xl"
                        src={transformToIpfsUrl(userProfile.picture?.uri)}
                      />
                    )}

                    {!userProfile.picture?.original &&
                      !userProfile.picture?.uri && (
                        <Avatar
                          size="xl"
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT29B69wuAtANWIv19S-HrkYOGdUqbwnVpcTDjCoovLPA&s"
                        />
                      )}
                  </Box>
                </Box>

                <Box mt="70px" ml="20px">
                  <Text
                    textAlign="center"
                    fontSize="24px"
                    fontWeight="bold"
                    color="black"
                  >
                    {userProfile.stats.totalFollowing}
                  </Text>

                  <Text fontSize="16px" fontWeight="bold" color="#6F6F6F">
                    Following
                  </Text>
                </Box>
              </Flex>
            </Center>

            <Box>
              <Text
                textAlign="center"
                fontSize="30px"
                fontWeight="bold"
                color="black"
              >
                {userProfile.name}
              </Text>

              <Text
                textAlign="center"
                fontSize="15px"
                fontWeight="bold"
                bgGradient="linear(to-l, gradient1, gradient2)"
                bgClip="text"
                pb="2"
              >
                @{userProfile.handle}
              </Text>
            </Box>
          </Box>

          <Center>
            <Divider borderWidth={1} width="80%" />
          </Center>

          <Center pt="2">
            <HStack justifyItems={"center"}>
              <Text fontSize="16px" fontWeight="light" color="#666666">
                Shared Poaps
              </Text>

              <Img src="./assets/poap-logo.png" w={10} />
            </HStack>
          </Center>

          <PoapContainer arr={common} length={arrLength} diff={arrDiff} />

          {common.length === 0 && (
            <>
              <Text
                textAlign="center"
                fontSize="18px"
                fontWeight="bold"
                color="#666666"
              >
                Nothing here
              </Text>

              <Text
                textAlign="center"
                fontSize="14px"
                fontWeight="light"
                color="#666666"
              >
                You should share a POAP with this user
              </Text>
            </>
          )}

          <Center mt="5">
            <Divider borderWidth={1} width="80%" />
          </Center>

          <Box mt="3">
            {!verifiedForUser ? (
              <HStack>
                <Box width="50%" m="auto" pt="4">
                  <Text fontSize="20px" fontWeight="bold" color="#7E7E7E">
                    {userProfile.name}
                  </Text>

                  <Text fontSize="12px" fontWeight="bold" color="#7E7E7E" p="1">
                    needs your verification
                  </Text>

                  <Button
                    bgGradient="linear(to-l, poapDark, pink.500)"
                    color="white"
                    borderRadius={"70px"}
                    boxShadow="0px 2px 3px rgba(0, 0, 0, 0.15)"
                    mb="2"
                    onClick={handleVerify}
                  >
                    <Text fontSize="12px" fontWeight="extrabold" color="white">
                      Verify
                    </Text>
                  </Button>
                </Box>

                <Img src="./assets/not-verificado-logo.png" w={20} pr="20px" />
              </HStack>
            ) : (
              <HStack>
                <Box width="80%">
                  <Text fontSize="20px" fontWeight="bold" color="#7E7E7E" p="3">
                    You have verified {userProfile.name}
                  </Text>
                </Box>

                <Img src="./assets/verificado-logo.png" w={20} pr="20px" />
              </HStack>
            )}
          </Box>

          <Link to="/dashboard">
            <Center>
              <Box
                bgGradient="linear(to-l, poapDark, pink.500)"
                roundedTop="30px"
                bottom="0"
                position="fixed"
                width="80%"
                height="50px"
                my="auto"
              >
                <Text
                  textAlign="center"
                  color="white"
                  fontSize="20px"
                  fontWeight="bold"
                  pt="8px"
                >
                  Home
                </Text>
              </Box>
            </Center>
          </Link>
        </>
      )}

      {transition.state === "loading" && !transition.submission && (
        <Box mt="10">
          <Text
            textAlign="center"
            fontWeight={700}
            fontSize={"25"}
            lineHeight={"30px"}
            color="lensDark"
          >
            Connecting with garden ...
          </Text>

          <Center>
            <Box mt="20px">
              <Image src="./assets/lens-loading.gif" rounded="2xl" />
            </Box>
          </Center>
        </Box>
      )}

      {transition.submission && (
        <>
          <Box>
            <Center mt="60px">
              <Flex mt="-60px">
                <Box mt="70px" mr="20px">
                  <Text
                    textAlign="center"
                    fontSize="24px"
                    fontWeight="bold"
                    color="black"
                  >
                    {userProfile.stats.totalFollowers}
                  </Text>
                  <Text fontSize="16px" fontWeight="bold" color="#6F6F6F">
                    Followers
                  </Text>
                </Box>

                <Box position="relative" display="inline-flex">
                  <CircularProgress
                    value={indexVm + arrLength}
                    size="150px"
                    color="gradient1"
                    thickness="8px"
                  />

                  <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {userProfile.picture?.original && (
                      <Avatar
                        size="xl"
                        src={transformToIpfsUrl(
                          userProfile.picture?.original?.url
                        )}
                      />
                    )}

                    {userProfile.picture?.uri && (
                      <Avatar
                        size="xl"
                        src={transformToIpfsUrl(userProfile.picture?.uri)}
                      />
                    )}

                    {!userProfile.picture?.original &&
                      !userProfile.picture?.uri && (
                        <Avatar
                          size="xl"
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT29B69wuAtANWIv19S-HrkYOGdUqbwnVpcTDjCoovLPA&s"
                        />
                      )}
                  </Box>
                </Box>

                <Box mt="70px" ml="20px">
                  <Text
                    textAlign="center"
                    fontSize="24px"
                    fontWeight="bold"
                    color="black"
                  >
                    {userProfile.stats.totalFollowing}
                  </Text>

                  <Text fontSize="16px" fontWeight="bold" color="#6F6F6F">
                    Following
                  </Text>
                </Box>
              </Flex>
            </Center>

            <Box>
              <Text
                textAlign="center"
                fontSize="30px"
                fontWeight="bold"
                color="black"
              >
                {userProfile.name}
              </Text>

              <Text
                textAlign="center"
                fontSize="15px"
                fontWeight="bold"
                bgGradient="linear(to-l, gradient1, gradient2)"
                bgClip="text"
                pb="2"
              >
                @{userProfile.handle}
              </Text>
            </Box>
          </Box>

          <Center>
            <Divider borderWidth={1} width="80%" />
          </Center>

          <Center pt="5">
            <HStack justifyItems={"center"}>
              <Text fontSize="16px" fontWeight="light" color="#666666">
                Shared Poaps
              </Text>

              <Img src="../assets/poap-logo.png" w={10} />
            </HStack>
          </Center>

          <PoapContainer arr={common} length={arrLength} diff={arrDiff} />

          {common.length === 0 && (
            <>
              <Text
                textAlign="center"
                fontSize="18px"
                fontWeight="bold"
                color="#666666"
              >
                Nothing here
              </Text>

              <Text
                textAlign="center"
                fontSize="14px"
                fontWeight="light"
                color="#666666"
              >
                You should share a POAP with this user
              </Text>
            </>
          )}

          <Center mt="5">
            <Divider borderWidth={1} width="80%" />
          </Center>

          <Box mt="3">
            <HStack>
              <Box width="80%">
                <Text fontSize="20px" fontWeight="bold" color="#7E7E7E" p="3">
                  You have verified {userProfile.name}
                </Text>
              </Box>

              <Img src="../verificado-logo.png" w={20} pr="20px" />
            </HStack>
          </Box>

          <Link to="/dashboard">
            <Center>
              <Box
                bgGradient="linear(to-l, poapDark, pink.500)"
                roundedTop="30px"
                bottom="0"
                position="fixed"
                width="80%"
                height="50px"
                my="auto"
              >
                <Text
                  textAlign="center"
                  color="white"
                  fontSize="20px"
                  fontWeight="bold"
                  pt="8px"
                >
                  Home
                </Text>
              </Box>
            </Center>
          </Link>
        </>
      )}
    </Box>
  );
}

export function ErrorBoundary({ error }: any) {
  return (
    <Flex
      h="calc(100vh)"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-evenly"
    >
      <Flex
        minH="calc(8vh)"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-around"
      >
        <Text fontWeight={600} fontSize={"25px"} lineHeight={"21.6px"}>
          Are you sure you have
        </Text>
        <Text fontWeight={600} fontSize={"25px"} lineHeight={"21.6px"}>
          the right{" "}
          <Text as="span" color="lensDark">
            Lens
          </Text>{" "}
          profile?
        </Text>
      </Flex>

      <Image maxH="calc(25vh)" src="./assets/sad-lens.png" />

      <Box pb="3rem">
        <Button
          minH="1rem"
          minW="10rem"
          bg="lens"
          color="white"
          borderRadius={30}
        >
          <Link to="/dashboard">
            <Flex alignItems="center">
              <Icon color="black" as={AiFillHome} />
              <Text
                color="black"
                fontWeight={700}
                fontSize={"15px"}
                lineHeight={"21.6px"}
                pl="0.8rem"
              >
                Go home
              </Text>
            </Flex>
          </Link>
        </Button>
      </Box>
    </Flex>
  );
}
