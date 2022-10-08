import {
  ActionFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import { useLoaderData, useSubmit } from "@remix-run/react";

import { GraphQLClient } from "graphql-request";

import { GetProfile } from "~/web3/lens";
import { comparePoaps } from "~/web3/poap";

import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Text,
} from "@chakra-ui/react";
import { transformToIpfsCoverImageUrl } from "~/web3/ipfs";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ params }) => {
  // TODO: get the address from cookie session
  const address = "0x3aeC2276326CDC8E9a8A4351c338166e67105AC3";

  const lens = new GraphQLClient("https://api.lens.dev/playground");

  const variables = {
    request: { handle: params.profile },
  };

  const response = await lens.request(GetProfile, variables);

  const userProfile = response.profile;

  const poapsComparted = await comparePoaps(address, userProfile.ownedBy);

  return { userProfile, poapsComparted };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const address = form.get("address");
  const poaps = form.get("poaps");

  if (!address || typeof address !== "string") return null;
  if (!poaps || typeof poaps !== "string") return null;

  console.log(poaps);

  try {
    const verified = await db.verified.findUnique({
      where: {
        address,
      },
    });

    await db.verified.update({
      where: {
        address: address,
      },
      data: {
        indexVM: verified!.indexVM + Number(poaps),
      },
    });
  } catch (error) {
    console.log(error);
  }

  return redirect(`/verified`);
};

export default function Profile() {
  const { userProfile, poapsComparted } = useLoaderData();

  const submit = useSubmit();

  const handleVerify = async () => {
    const formData = new FormData();

    formData.append("address", "0x3aeC2276326CDC8E9a8A4351c338166e67105AC3");
    formData.append("poaps", poapsComparted.length);

    submit(formData, {
      action: `${userProfile.handle}/?index`,
      method: "post",
      encType: "application/x-www-form-urlencoded",
      replace: true,
    });
  };

  return (
    <Box>
      <Center>
        <Flex mt="25px">
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

          <Avatar
            size="2xl"
            name="Segun Adebayo"
            src={transformToIpfsCoverImageUrl(
              userProfile.coverPicture?.original?.url
            )}
          />

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

        <Center mt="20px">
          <Divider w="80%" />
        </Center>

        <Text
          textAlign="center"
          fontSize="20px"
          fontWeight="light"
          color="second"
          mt="20px"
        >
          Poaps compartidos: {poapsComparted.length}
        </Text>
      </Box>

      <Center mt="20px">
        <Button
          backgroundColor="second"
          color="white"
          rounded={"full"}
          fontSize="18px"
          onClick={handleVerify}
        >
          Verificar
        </Button>
      </Center>
    </Box>
  );
}
