import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { db } from "~/utils/db.server";

import { Button, Center, Stack, Text } from "@chakra-ui/react";
import { useLoaderData, useSubmit } from "@remix-run/react";

export const loader: LoaderFunction = async () => {
  let verified;

  try {
    verified = await db.verified.findUnique({
      where: {
        address: "0x3aeC2276326CDC8E9a8A4351c338166e67105AC3",
      },
    });

    if (!verified) {
      await db.verified.create({
        data: {
          address: "0x3aeC2276326CDC8E9a8A4351c338166e67105AC3",
          indexVM: 0,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }

  return { verified };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const address = form.get("address");

  console.log(address);

  if (!address || typeof address !== "string") return null;

  return null;
};

export default function Verified() {
  const { verified } = useLoaderData();

  const submit = useSubmit();

  const handleVerify = async () => {
    const formData = new FormData();

    formData.append("address", "0x3aeC2276326CDC8E9a8A4351c338166e67105AC3");

    submit(formData, {
      action: "/verified/?index",
      method: "post",
      encType: "application/x-www-form-urlencoded",
      replace: true,
    });
  };

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
          Indice de verificación: {verified?.indexVM} %
        </Text>

        <Center>
          <Button
            bg={"first"}
            color="white"
            borderRadius={70}
            mt="300px"
            onClick={handleVerify}
          >
            <Text fontWeight={700} fontSize={"18px"} lineHeight={"21.6px"}>
              Verificar
            </Text>
          </Button>
        </Center>
      </Stack>
    </Center>
  );
}
