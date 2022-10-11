import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useSubmit,
  useTransition,
} from "@remix-run/react";

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
  Icon,
  Button,
} from "@chakra-ui/react";

import { AiOutlineSearch } from "react-icons/ai";
import { BsPlus } from "react-icons/bs";

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

  if (!profile) {
    throw new Error();
  }

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
  const transition = useTransition();

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

  return (
    <Box>
      {transition.state === "idle" && (
        <>
          <Box>
            <HStack>
              <Box px={5}>
                <Text fontSize="20px" fontWeight="bold" color="black">
                  {profile?.name}
                </Text>

                <Text
                  textAlign="center"
                  fontSize="15px"
                  fontWeight="bold"
                  bgGradient="linear(to-l, gradient1, gradient2)"
                  bgClip="text"
                >
                  @{profile?.handle}
                </Text>
              </Box>

              <Box>
                <Box position="relative" display="inline-flex" ml="0px">
                  <CircularProgress
                    value={getRatioValidation(
                      indexVm,
                      profile?.stats.totalFollowers
                    )}
                    size="150px"
                    color="gradient1"
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
                  <Link to={`/${post.profile?.handle}`}>
                    <Box>
                      {post.profile.picture?.original?.url ? (
                        <Avatar
                          size="md"
                          src={transformToIpfsUrl(
                            post.profile?.picture?.original?.url
                          )}
                        />
                      ) : (
                        <Avatar
                          size="md"
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT29B69wuAtANWIv19S-HrkYOGdUqbwnVpcTDjCoovLPA&s"
                        />
                      )}
                    </Box>
                  </Link>

                  <Link to={`/${post.profile?.handle}`} prefetch="intent">
                    <Stack>
                      <Text>{post.profile.name}</Text>
                      <Text
                        bgGradient="linear(to-l, gradient1, gradient2)"
                        bgClip="text"
                        fontSize="sm"
                        fontWeight="600"
                      >
                        @{post.profile.handle}
                      </Text>
                    </Stack>
                  </Link>

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
              bgGradient="linear(to-l, poapDark, pink.500)"
              roundedTop="30px"
              bottom="0"
              position="fixed"
              width="80%"
              height="50px"
              my="auto"
            >
              <Text
                textAlign="center"
                color="white"
                fontSize="20px"
                fontWeight="bold"
                pt="8px"
              >
                Logout
              </Text>
            </Box>
          </Center>
        </>
      )}

      {transition.state === "loading" && (
        // {true && (
        <Box mt="-80px">
          <Text textAlign="center" fontSize="26px" color="lensDark" mt="25px">
            Joining Lens protocol with POAPs
          </Text>

          <Flex justifyContent="center">
            <Box mt="20px" width="40%" height="40%">
              <Image src="./assets/LENS LOGO__Lens_ icon.png" />
            </Box>

            <Icon fontSize="4xl" color="lensDark" as={BsPlus} m="auto" />

            <Box mt="28px" width="40%" height="40%">
              <Image
                src="https://www.niftytable.com/content/images/2021/09/v2-jzTZE9PtJ8Mmvqe_qnjc4DMzhJmNtBkdALWAtyjc.jpg "
                width="80%"
                height="80%"
              />
            </Box>
          </Flex>

          <Center mt="50px">
            <CircularProgress color="lensDark" isIndeterminate />
          </Center>
        </Box>
      )}
    </Box>
  );
}

export function ErrorBoundary({ error }: any) {
  return (
    <Flex
      h="calc(100vh)"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-evenly"
    >
      <Flex flexDirection="column" alignItems="center">
        <Text fontWeight={600} fontSize={"25px"} lineHeight={"21.6px"}>
          Connect your profile
        </Text>
        <Text fontWeight={600} fontSize={"25px"} lineHeight={"21.6px"}>
          with{" "}
          <Text as="span" color="">
            Lens
          </Text>
        </Text>
      </Flex>
      <Image maxH="calc(50vh)" src="./assets/lens-light-green.png" />
      <Button
        minH="4rem"
        minW="20rem"
        bg="lensDark"
        color="white"
        borderRadius={30}
      >
        <Flex alignItems="center">
          <Image src="./assets/grey-logo.png" pr="1rem" />
          <Text fontWeight={400} fontSize={"25px"} lineHeight={"21.6px"}>
            Lens Connect
          </Text>
        </Flex>
      </Button>
    </Flex>
  );
}
