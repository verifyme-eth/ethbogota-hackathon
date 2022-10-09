import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { useLoaderData, useSubmit } from "@remix-run/react";

import { GraphQLClient } from "graphql-request";

import { GetProfile } from "~/web3/lens";
import { comparePoaps } from "~/web3/poap";
import { transformToIpfsUrl } from "~/web3/ipfs";

import { db } from "~/utils/db.server";

import { destroySession, getSession } from "~/bff/session";

import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Text,
  Image,
  CircularProgress,
  Img,
  HStack,
  Divider,
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
      indexVm += verifiers[address].length;
    }
  } else {
    indexVm = 0;
    verifiedForUser = false;
  }

  return { userProfile, common, arrLength, arrDiff, indexVm, verifiedForUser };
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();

  const address = form.get("address");
  const profileAddress = form.get("profileAddress");
  const poaps = form.get("poaps");
  const intent = form.get("intent");

  if (!address || typeof address !== "string") return null;
  if (!profileAddress || typeof profileAddress !== "string") return null;
  if (!poaps || typeof poaps !== "string") return null;
  if (!intent || typeof intent !== "string") return null;

  console.log(profileAddress);

  if (intent == "verify") {
    const verified = await db.verified.findUnique({
      where: {
        address: profileAddress.toLowerCase(),
      },
    });

    console.log(verified);

    // if (verified) {
    //   const poapsVerified = JSON.parse(verified.poaps);

    //   poapsVerified[address].push(poaps);

    //   await db.verified.update({
    //     where: {
    //       address: address.toLowerCase(),
    //     },
    //     data: {
    //       poaps: JSON.stringify(poapsVerified),
    //     },
    //   });
    // } else {
    //   const poapsVerified = {
    //     [address]: [poaps],
    //   };

    //   await db.verified.create({
    //     data: {
    //       address: address.toLowerCase(),
    //       poaps: JSON.stringify(poapsVerified),
    //     },
    //   });
    // }
  }

  return redirect(request.url);
};

export default function Profile() {
  const {
    address,
    userProfile,
    common,
    arrLength,
    arrDiff,
    indexVm,
    verifiedForUser,
  } = useLoaderData();

  const submit = useSubmit();

  const handleVerify = async () => {
    const formData = new FormData();

    formData.append("address", address);
    formData.append("profileAddress", userProfile.ownedBy);
    formData.append("poaps", "[1 , 2 , 3 , 5]");
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
    <Box>
      <Box pt={10}>
        <Center>
          <Box boxSize="140px">
            <Image src="./assets/LogoCompleto.png" />
          </Box>
        </Center>
      </Box>

      <Box
        backgroundColor="#FEE7B9"
        borderTopLeftRadius="30"
        borderTopRightRadius="30"
      >
        <Center>
          <Flex mt="-60px">
            <Box mt="70px" mr="20px">
              <Text
                textAlign="center"
                fontSize="24px"
                fontWeight="bold"
                color="black"
              >
                7
              </Text>
              <Text fontSize="16px" fontWeight="bold" color="#6F6F6F">
                Followers
              </Text>
            </Box>

            <Box position="relative" display="inline-flex">
              <CircularProgress
                value={indexVm}
                size="150px"
                color="#71AA43"
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
                37
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

      {/* <Text
        textAlign="center"
        fontSize="12px"
        fontWeight="light"
        color="#666666"
        p="6px"
      >
        {userProfile.bio}
      </Text> */}

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
              <Img src="./assets/notverified.png" width="50%" height="50%" />
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
      </Box>

      <Center onClick={handleLogout}>
        <Box
          bg="third"
          roundedTop="30px"
          bottom="0"
          position="fixed"
          width="90%"
          height="50px"
          my="auto"
        >
          <Text textAlign="center" fontSize="20px" fontWeight="bold" pt="8px">
            Logout
          </Text>
        </Box>
      </Center>
    </Box>
  );
}
