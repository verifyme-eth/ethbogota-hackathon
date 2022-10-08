import {
  Flex,
  Center,
  Box,
  ListItem,
  Text,
  UnorderedList,
  Input,
  FormControl,
} from "@chakra-ui/react";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { comparePoaps } from "~/web3/poap";

export const loader: LoaderFunction = async () => {
  let addressMain = "gutybv.eth";
  let addressCompared = "cristianvaldivia.eth";

  let common = await comparePoaps(addressMain, addressCompared);

  return { common };
};

export const action = async (req: any) => {
  const form = await req.formData();
  const adress1 = form.get("adr1");
  const adress2 = form.get("adr2");
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
      <Box>
        <Center>
          <Box w="30%">
            <form method="POST">
              <FormControl>
                <Input name="adr1" id="adr1" placeholder="Adress 1" />
                <Input name="adr2" id="adr2" placeholder="Adress 2" />
              </FormControl>
            </form>
          </Box>
        </Center>
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
