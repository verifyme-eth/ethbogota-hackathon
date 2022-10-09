import { Flex, Center, Box, Text } from "@chakra-ui/react";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PoapContainer from "~/components/PoapContainer";
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
