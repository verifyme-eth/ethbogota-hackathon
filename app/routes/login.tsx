import { Center, Text, Box, Image, Button } from "@chakra-ui/react";
// import { db } from "~/utils/db.server";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet, useSubmit, useTransition } from "@remix-run/react";

export default function Login() {
  const submit = useSubmit();
  const transition = useTransition();

  return (
    <Box>
      <Box>
        <Center>
          <Text
            fontSize="30px"
            fontWeight={700}
            mt="30"
            color="primary"
            align="center"
            pt={20}
            pb={5}
          >
            The autentication <br /> for all the world
          </Text>
        </Center>
      </Box>
      <Box>
        <Center>
          <Box boxSize="270px" pt={20}>
            <Image
              src="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F9d4db6f3-c0f4-42e1-a0f2-862776ae0c92%2Flogin-box.png?table=block&id=e9d62a02-5780-4646-9d7d-3d7b5ba464e3&spaceId=44514f37-bf45-41b8-90cd-647cbf4961f7&width=1730&userId=f6eb0ab4-bc9f-402b-b477-e57a6aa6ecc6&cache=v2"
              alt="hola"
            />
          </Box>
        </Center>
      </Box>
      <Box pt={40}>
        <Center>
          <Button colorScheme="blue">Wallet Connect</Button>
        </Center>
      </Box>
    </Box>
  );
}
