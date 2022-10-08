import { Avatar, Box, Center, Flex, Grid, Stack, Text } from "@chakra-ui/react";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { GraphQLClient } from "graphql-request";

import { ExplorePublications } from "~/web3/lens";

export const loader: LoaderFunction = async () => {
  const lens = new GraphQLClient("https://api.lens.dev/playground");

  console.log("[dashboard/friends] Fetching feed from Lens API ...");

  const response = await lens.request(ExplorePublications);

  const recentsPosts = response.explorePublications;

  return recentsPosts;
};

export default function Dashboard() {
  const recentsPosts = useLoaderData();

  console.log(recentsPosts);

  return (
    <Stack>
      <Box
        maxW="sm"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p="3"
      >
        <Flex justifyContent="space-between">
          <Avatar
            size="lg"
            name="Segun Adebayo"
            src="https://image.shutterstock.com/image-vector/profile-vector-glyph-flat-icon-260nw-1697842372.jpg"
          />

          <Box my="auto">
            <Text>LensBeats</Text>
            <Text>@lensbeats.lend</Text>
          </Box>

          <Box my="auto" left={0}>
            <Text>2h</Text>
          </Box>
        </Flex>
        Este post deberia ser un componente separado y hermoso, por ahora voy a
        copiar el diseño que tenia anteriormente
      </Box>
    </Stack>
  );
}
