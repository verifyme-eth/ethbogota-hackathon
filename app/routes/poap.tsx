import {
  Flex,
  Center,
  Box,
  ListItem,
  Text,
  UnorderedList,
  Input,
  FormControl,
  AvatarGroup,
  Avatar,
  SimpleGrid,
} from "@chakra-ui/react";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { comparePoaps } from "~/web3/poap";

export const loader: LoaderFunction = async () => {
  let addressMain = "gutybv.eth";
  let addressCompared = "cristianvaldivia.eth";

  let { common, arrLength, arrDiff } = await comparePoaps(
    addressMain,
    addressCompared
  );

  return { common, arrLength, arrDiff };
};

export const action = async (req: any) => {
  const form = await req.formData();
  const adress1 = form.get("adr1");
  const adress2 = form.get("adr2");
};

type PoapContainerProps = {
  arr: any;
  length: number;
  diff: number;
};

function PoapContainer({ arr, length, diff }: PoapContainerProps) {
  return (
    <Box pt="1rem" pb="1rem">
      <SimpleGrid columns={3} spacing="1.5rem">
        {length > 11 ? (
          <>
            {arr
              .map((poap: any) => (
                <Box>
                  <Center>
                    <Avatar name={poap.name} src={poap.image_url} size="lg" />
                  </Center>
                </Box>
              ))
              .slice(0, 11)}
            <Box>+ {diff}</Box>
          </>
        ) : (
          <>
            {arr.map((poap: any) => (
              <Box>
                <Center>
                  <Avatar name={poap.name} src={poap.image_url} size="lg" />
                </Center>
              </Box>
            ))}
          </>
        )}
      </SimpleGrid>
    </Box>
  );
}

export default function Index() {
  const { common, arrLength, arrDiff } = useLoaderData();
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
      <PoapContainer arr={common} length={arrLength} diff={arrDiff} />
    </Flex>
  );
}
