import {
  Flex,
  Center,
  Box,
  ListItem,
  Text,
  UnorderedList,
  Input,
} from "@chakra-ui/react";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { comparePoaps } from "~/web3/poapVerification";

export const loader: LoaderFunction = async () => {
  let addressMain = "nate-d3v.eth";
  let addressCompared = "cristianvaldivia.eth";

  let common = await comparePoaps(addressMain, addressCompared);

  return { common };
};

export default function Index() {
  const { common } = useLoaderData();
  return (
    <Flex direction="column">
      <Box>
        <Center>
          <Text fontSize="56px" fontWeight={700} mt="30" color="primary">
            Verify me
          </Text>
        </Center>
      </Box>
      <Box w="30%">
        <Input placeholder="Adress 1" />
      </Box>
      <Box>
        <Center>
          <UnorderedList>
            {common.map((poap: any, index: number) => (
              <ListItem key={index}>
                <h2>{poap}</h2>
              </ListItem>
            ))}
          </UnorderedList>
        </Center>
      </Box>
    </Flex>
  );
}
