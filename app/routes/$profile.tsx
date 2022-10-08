import type { LoaderFunction } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";

import { GraphQLClient } from "graphql-request";

import { GetProfile } from "~/web3/lens";
import { comparePoaps } from "~/web3/poap";

import { Avatar, Box, Center, Divider, Flex, Text } from "@chakra-ui/react";
import { transformToIpfsCoverImageUrl } from "~/web3/ipfs";

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

      <Box>
        <Text fontSize="30px" fontWeight="bold" color="black">
          {userProfile.name}
        </Text>

        <Text fontSize="15px" fontWeight="light" color="#767676">
          @{userProfile.handle}
        </Text>

        <Text fontSize="12px" fontWeight="light" color="#666666">
          {userProfile.bio}
        </Text>

        <Divider />

        <Text fontSize="20px" fontWeight="light" color="second">
          Poaps compartidos: {poapsComparted.length}
        </Text>
      </Box>
    </Box>
  );
}
