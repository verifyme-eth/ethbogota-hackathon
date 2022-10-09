import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { useLoaderData, useSubmit } from "@remix-run/react";

import { GraphQLClient } from "graphql-request";

import { GetProfile } from "~/web3/lens";
import { comparePoaps } from "~/web3/poap";

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
} from "@chakra-ui/react";

import { transformToIpfsUrl } from "~/web3/ipfs";
import { db } from "~/utils/db.server";
import PoapContainer from "~/components/PoapContainer";
import { destroySession, getSession } from "~/bff/session";

export const loader: LoaderFunction = async ({ params, request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const address = session.get("address");

  const lens = new GraphQLClient("https://api.lens.dev/playground");

  const variables = {
    request: { handle: params.profile },
  };

  const response = await lens.request(GetProfile, variables);

  const userProfile = response.profile;

  const { common, arrLength, arrDiff } = await comparePoaps(
    address,
    userProfile.ownedBy
  );

  return { userProfile, common, arrLength, arrDiff };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const address = form.get("address");
  const connected = form.get("connected");

  if (!address || typeof address !== "string") return null;
  if (!connected || typeof connected !== "string") return null;

  await db.user.update({
    where: {
      address,
    },
    data: {
      connected: connected === "true",
    },
  });

  const session = await getSession(request.headers.get("Cookie"));

  return redirect(`/login`, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export default function Profile() {
  const { userProfile, common, arrLength, arrDiff } = useLoaderData();

  const submit = useSubmit();

  // const handleVerify = async () => {
  //   const formData = new FormData();

  //   formData.append("address", "0x3aeC2276326CDC8E9a8A4351c338166e67105AC3");
  //   formData.append("poaps", poapsComparted.length);

  //   submit(formData, {
  //     action: `${userProfile.handle}/?index`,
  //     method: "post",
  //     encType: "application/x-www-form-urlencoded",
  //     replace: true,
  //   });
  // };

  const handleLogout = () => {
    const formData = new FormData();

    formData.append("address", "0x3aec2276326cdc8e9a8a4351c338166e67105ac3");
    formData.append("connected", "false");

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
                value={80}
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
          >
            @{userProfile.handle}
          </Text>

          <Text
            textAlign="center"
            fontSize="12px"
            fontWeight="light"
            color="#666666"
            p="6px"
          >
            {userProfile.bio}
          </Text>
        </Box>
      </Box>

      <Flex>
        <Text fontSize="16px" fontWeight="light" color="#666666" m="auto">
          Shared Poaps
        </Text>

        <Img
          src="https://www.niftytable.com/content/images/2021/09/v2-jzTZE9PtJ8Mmvqe_qnjc4DMzhJmNtBkdALWAtyjc.jpg "
          width="20%"
          height="20%"
        />
      </Flex>

      <PoapContainer arr={common} length={arrLength} diff={arrDiff} />

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
