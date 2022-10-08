import type { LoaderFunction } from "@remix-run/server-runtime";

import { Box, Center, Text } from "@chakra-ui/react";
import { useLoaderData } from "@remix-run/react";
import { GraphQLClient } from "graphql-request";
import { GetProfile } from "~/web3/lens";

export const loader: LoaderFunction = async ({ params }) => {
  const lens = new GraphQLClient("https://api.lens.dev/playground");

  const variables = {
    request: { handle: params.profile },
  };

  const response = await lens.request(GetProfile, variables);

  const userProfile = response.profile;

  return { userProfile };
};

export default function Profile() {
  const { userProfile } = useLoaderData();

  console.log(userProfile);

  return (
    <Center>
      <Box>
        <Text fontSize="25px" fontWeight="bold" color="first">
          {userProfile.name}
        </Text>

        <Text fontSize="20px" fontWeight="light" color="second">
          @{userProfile.handle}
        </Text>
      </Box>
    </Center>
  );
}
