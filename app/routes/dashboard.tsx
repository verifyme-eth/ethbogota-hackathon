import { Center, Text } from "@chakra-ui/react";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  return { message: "Hello World" };
};

export default function dashboard() {
  return (
    <Center>
      <Text fontSize="56px" fontWeight={700} mt="30" color="primary">
        Dashboard
      </Text>
    </Center>
  );
}
