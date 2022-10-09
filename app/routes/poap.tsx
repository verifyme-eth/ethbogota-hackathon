import {
  Flex,
  Center,
  Box,
  Text,
  Input,
  FormControl,
  Avatar,
  SimpleGrid,
} from "@chakra-ui/react";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { comparePoaps } from "~/web3/poap";

export const loader: LoaderFunction = async () => {
  let addressMain = "gutybv.eth";
  let addressCompared = "cristianvaldivia.eth";

  const { common, arrLength, arrDiff } = await comparePoaps(
    addressMain,
    addressCompared
  );

  return { common, arrLength, arrDiff };
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
                <Box key={poap.name}>
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
              <Box key={poap.name}>
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

      <PoapContainer arr={common} length={arrLength} diff={arrDiff} />
    </Flex>
  );
}
