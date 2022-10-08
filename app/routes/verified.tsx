import type { LoaderFunction } from "@remix-run/node";

import { db } from "~/utils/db.server";

import { Center, Stack, Text } from "@chakra-ui/react";

export const loader: LoaderFunction = async () => {
  let verified;

  try {
    verified = await db.user.findUnique({
      where: {
        address: "0x3aeC2276326CDC8E9a8A4351c338166e67105AC3",
      },
    });
  } catch (error) {
    console.log(error);
  }

  console.log(verified);

  return { message: "Hello World" };
};

export default function Verified() {
  return (
    <Center>
      <Stack>
        <Text fontSize="36px" fontWeight={700} mt="30" color="first">
          Cristian Valdivia
        </Text>

        <Text fontSize="24px" fontWeight={700} mt="30" color="second">
          @cristianvaldivia
        </Text>

        <Text fontSize="24px" fontWeight={700} mt="30" color="third">
          Indice de verificación: 35 %
        </Text>
      </Stack>
    </Center>
  );
}
