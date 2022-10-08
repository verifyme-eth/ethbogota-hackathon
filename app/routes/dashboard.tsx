import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";

import { GraphQLClient } from "graphql-request";

import { ExplorePublications } from "~/web3/lens";

import { db } from "~/utils/db.server";
import { destroySession, getSession } from "~/bff/session";

import { Avatar, Box, Center, Flex, Stack, Text } from "@chakra-ui/react";

export const loader: LoaderFunction = async () => {
  const lens = new GraphQLClient("https://api.lens.dev/playground");

  console.log("[dashboard/friends] Fetching feed from Lens API ...");

  const response = await lens.request(ExplorePublications);

  const recentsPosts = response.explorePublications;

  return recentsPosts;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const address = form.get("address");
  const connected = form.get("connected");

  if (!address || typeof address !== "string") return null;
  if (!connected || typeof connected !== "string") return null;

  console.log(address);

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

export default function Dashboard() {
  const submit = useSubmit();
  // const recentsPosts = useLoaderData();

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
    </Stack>
  );
}
