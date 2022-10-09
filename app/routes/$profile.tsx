import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { useLoaderData, useSubmit, useTransition } from "@remix-run/react";

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
} from "@chakra-ui/react";

import PoapContainer from "~/components/PoapContainer";

import { BiLogOutCircle } from "react-icons/bi";

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
      replace: true,
    });
  };

  const handleLogout = () => {
    const formData = new FormData();

    formData.append("address", "0x3aec2276326cdc8e9a8a4351c338166e67105ac3");
    formData.append("connected", "false");
    formData.append("intent", "logout");

    submit(formData, {
      action: "/dashboard/?index",
      method: "post",
      encType: "application/x-www-form-urlencoded",
      replace: true,
    });
  };

  return (
    <Box pt="20px">
      <Box
        backgroundColor="#FEE7B9"
        borderTopLeftRadius="30"
        borderTopRightRadius="30"
      >
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
              {!transition.submission && (
                <CircularProgress
                  value={indexVm}
                  size="150px"
                  color="#71AA43"
                  thickness="8px"
                />
              )}

              {transition.submission && (
                <CircularProgress
                  value={indexVm + arrLength}
                  size="150px"
                  color="#71AA43"
                  thickness="8px"
                />
              )}

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
                {userProfile.picture ? (
                  <Avatar
                    size="xl"
                    src={transformToIpfsUrl(userProfile.picture?.original?.url)}
                  />
                ) : (
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

        <Box mt="20px">
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
            fontWeight="light"
            color="#767676"
            pb="2"
          >
            @{userProfile.handle}
          </Text>
        </Box>
      </Box>

      <Divider borderWidth={2} />

      <HStack pl="45px">
        <Text fontSize="16px" fontWeight="light" color="#666666">
          Shared Poaps
        </Text>

        <Img
          src="https://www.niftytable.com/content/images/2021/09/v2-jzTZE9PtJ8Mmvqe_qnjc4DMzhJmNtBkdALWAtyjc.jpg "
          width="20%"
          height="20%"
        />
      </HStack>

      <PoapContainer arr={common} length={arrLength} diff={arrDiff} />

      <Box
        backgroundColor="#FEE7B9"
        borderBottomLeftRadius="30"
        borderBottomRightRadius="30"
        mt="3"
      >
        {!transition.submission && (
          <>
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
                    bg="white"
                    boxShadow="0px 2px 3px rgba(0, 0, 0, 0.15)"
                    borderRadius="70px"
                    width="100px"
                    mb="2"
                    onClick={handleVerify}
                  >
                    <Text fontSize="12px" fontWeight="extrabold" color="#black">
                      Verify
                    </Text>
                  </Button>
                </Box>

                <Center>
                  <Img
                    src="./assets/notverified.png"
                    width="50%"
                    height="50%"
                  />
                </Center>
              </HStack>
            ) : (
              <HStack>
                <Box width="80%">
                  <Text fontSize="20px" fontWeight="bold" color="#7E7E7E" p="3">
                    You have verified {userProfile.name}
                  </Text>
                </Box>

                <Center>
                  <Img src="./assets/verified.png" width="50%" height="50%" />
                </Center>
              </HStack>
            )}
          </>
        )}

        {transition.submission && (
          <HStack>
            <Box width="80%">
              <Text fontSize="20px" fontWeight="bold" color="#7E7E7E" p="3">
                You have verified {userProfile.name}
              </Text>
            </Box>

            <Center>
              <Img src="./assets/verified.png" width="50%" height="50%" />
            </Center>
          </HStack>
        )}
      </Box>

      <Box
        bg="third"
        roundedTopLeft="5px"
        bottom="0"
        right="0"
        position="fixed"
        height="50px"
        width="40px"
        onClick={handleLogout}
      >
        <Icon fontSize="4xl" color="lensDark" as={BiLogOutCircle} />
      </Box>
    </Box>
  );
}
