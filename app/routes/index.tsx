import { Center, Text } from "@chakra-ui/react";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  console.log("Ok ");
  return { message: "Hello World" };
};

export default function Index() {
  return (
    <Center>
      <Text fontSize="56px" fontWeight={700} mt="30" color="primary">
        Verify me
      </Text>
    </Center>
  );
}
