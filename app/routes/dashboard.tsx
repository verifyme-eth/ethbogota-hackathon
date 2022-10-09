import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";

import { GraphQLClient } from "graphql-request";

import { ExplorePublications, GetDefaultProfile } from "~/web3/lens";

import { db } from "~/utils/db.server";
import { destroySession, getSession } from "~/bff/session";
import { transformToIpfsUrl } from "~/web3/ipfs";

import {
  Avatar,
  Box,
  Center,
  Flex,
  Stack,
  Text,
  Image,
  HStack,
  CircularProgress,
  Input,
  Divider,
  Button,
  Icon,
} from "@chakra-ui/react";

import { AiOutlineSearch } from "react-icons/ai";
import React from "react";
import { getRatioValidation } from "~/web3/verify-me";
import { resume } from "~/utils/text";
import { calculateHoursBetweenNowAndDate } from "~/utils/hour";

export const loader: LoaderFunction = async ({ request }) => {
  // Get address from cookie session
  const session = await getSession(request.headers.get("Cookie"));

  const address = session.get("address");

  // Get feed from Lens protocol
  const lens = new GraphQLClient("https://api.lens.dev/playground");

  console.log("[dashboard/friends] Fetching feed from Lens API ...");

  const responsePublications = await lens.request(ExplorePublications);

  const recentsPosts = responsePublications.explorePublications;

  // Get default profile from Lens
  const variables: any = {
    request: { ethereumAddress: address },
  };

  const responseProfile = await lens.request(GetDefaultProfile, variables);

  const profile = responseProfile.defaultProfile;

  // Get if user is verified
  const verified = await db.verified.findUnique({
    where: {
      address: address.toLowerCase(),
    },
  });

  let indexVm = 0;

  if (verified) {
    const verifiers = JSON.parse(verified?.poaps as string);

    for (let address in verifiers) {
      indexVm += JSON.parse(verifiers[address]).length;
    }
  } else {
    indexVm = 0;
  }

  return { recentsPosts, address, profile, indexVm };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const address = form.get("address");
  const connected = form.get("connected");
  const intent = form.get("intent");
  const profileToGo = form.get("profileToGo");

  if (intent === "search") {
    return redirect(`/${profileToGo}`);
  }

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

export default function Dashboard() {
  const submit = useSubmit();

  const { address, recentsPosts, profile, indexVm } = useLoaderData();

  const handleLogout = () => {
    const formData = new FormData();

    formData.append("address", address);
    formData.append("connected", "false");

    submit(formData, {
      action: "/dashboard/?index",
      method: "post",
      encType: "application/x-www-form-urlencoded",
      replace: true,
    });
  };

  const handleSearch = () => {
    const formData = new FormData();

    formData.append("profileToGo", value);
    formData.append("intent", "search");

    submit(formData, {
      action: "/dashboard/?index",
      method: "post",
      encType: "application/x-www-form-urlencoded",
      replace: true,
    });
  };

  // TODO: can I use this?
  const [value, setValue] = React.useState("");
  const handleChange = (event: any) => setValue(event.target.value);

  console.log(recentsPosts);

  return (
    <Box>
      <Box pt={10}>
        <Center>
          <Box boxSize="140px">
            <Image src="./assets/LogoCompleto.png" />
          </Box>
        </Center>
      </Box>

      <Box mt="-80px">
        <HStack>
          <Box px={20} backgroundColor="#FEDFA2">
            <Text
              textAlign="center"
              fontSize="20px"
              fontWeight="bold"
              color="black"
            >
              {profile?.name}
            </Text>
            <Text
              textAlign="center"
              fontSize="15px"
              fontWeight="600"
              color="#767676"
            >
              @{profile?.handle}
            </Text>
          </Box>

          <Box>
            <Box position="relative" display="inline-flex" ml="-60px">
              <CircularProgress
                value={getRatioValidation(
                  indexVm,
                  profile.stats.totalFollowers
                )}
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
                {profile.picture ? (
                  <Avatar
                    size="xl"
                    src={transformToIpfsUrl(profile.picture?.original?.url)}
                  />
                ) : (
                  <Avatar
                    size="xl"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT29B69wuAtANWIv19S-HrkYOGdUqbwnVpcTDjCoovLPA&s"
                  />
                )}
              </Box>
            </Box>
          </Box>
        </HStack>
      </Box>

      <Box>
        <Flex mt="-60px">
          <Box mt="20px" mr="30px" ml="20px">
            <Text
              textAlign="center"
              fontSize="24px"
              fontWeight="bold"
              color="black"
            >
              {profile?.stats.totalFollowers}
            </Text>
            <Text fontSize="16px" fontWeight="bold" color="#6F6F6F">
              Followers
            </Text>
          </Box>

          <Box mt="20px" pl="10px">
            <Text
              textAlign="center"
              fontSize="24px"
              fontWeight="bold"
              color="black"
            >
              {profile?.stats.totalFollowing}
            </Text>
            <Text fontSize="16px" fontWeight="bold" color="#6F6F6F">
              Following
            </Text>
          </Box>
        </Flex>
      </Box>

      <Box mt="20px" ml="15px" mb="18px" mr="15px">
        <HStack>
          <Box width="330px">
            <Input
              value={value}
              onChange={handleChange}
              placeholder="Find your friends"
              borderRadius={20}
              backgroundColor="#E3E3E4"
            />
          </Box>

          <Button onClick={handleSearch}>
            <Icon fontSize="4xl" color="green.800" as={AiOutlineSearch} />
          </Button>
        </HStack>
      </Box>

      {recentsPosts.items.map((post: any) => (
        <Box key={post.id}>
          <Divider borderWidth={1} />

          <Box ml="20px" mt="20px">
            <HStack>
              <Box>
                {post.picture ? (
                  <Avatar
                    size="md"
                    src={transformToIpfsUrl(post.picture?.original?.url)}
                  />
                ) : (
                  <Avatar
                    size="md"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT29B69wuAtANWIv19S-HrkYOGdUqbwnVpcTDjCoovLPA&s"
                  />
                )}
              </Box>
              <Stack>
                <Text>{post.profile.name}</Text>
                <Text color="green" fontSize="sm">
                  @{post.profile.handle}
                </Text>
              </Stack>
              <Box>
                <Text ml="130px" color="gray" mb="30px" fontSize="sm">
                  {calculateHoursBetweenNowAndDate(post?.createdAt)} h
                </Text>
              </Box>
            </HStack>

            <Box ml="60px" mt="10px">
              <Text
                pr="10"
                pb="10"
                textAlign="justify"
                fontSize="16px"
                color="#7E7E7E"
              >
                {resume(post?.metadata?.content)}
              </Text>
            </Box>
          </Box>
        </Box>
      ))}

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
