import type { LoaderFunction } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";

import { GraphQLClient } from "graphql-request";

import { GetProfile } from "~/web3/lens";
import { comparePoaps } from "~/web3/poap";

import { Box, Center, Divider, Text } from "@chakra-ui/react";

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

export default function Profile() {
  const { userProfile, poapsComparted } = useLoaderData();

  return (
    <Center>
      <Box>
        <Text fontSize="25px" fontWeight="bold" color="first">
          {userProfile.name}
        </Text>

        <Text fontSize="20px" fontWeight="light" color="second">
          @{userProfile.handle}
        </Text>

        <Divider />

        <Text fontSize="20px" fontWeight="light" color="second">
          Poaps compartidos: {poapsComparted.length}
        </Text>
      </Box>
    </Center>
  );
}
