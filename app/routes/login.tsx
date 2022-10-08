import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useSubmit } from "@remix-run/react";

import { db } from "~/utils/db.server";

import { commitSession, getSession } from "~/bff/session";

import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

import { Center, Text, Box, Image, Button } from "@chakra-ui/react";
import { subscribeToEvents } from "~/web3/wallet-connect";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const form = await request.formData();

  const address = form.get("address");
  const connected = form.get("connected");

  if (!address || typeof address !== "string") return null;
  if (!connected || typeof connected !== "string") return null;

  let user;

  try {
    user = await db.user.findFirst({
      where: {
        address: address,
      },
    });

    if (!user) {
      await db.user.create({
        data: {
          address: address.toLowerCase(),
          connected: connected === "true",
        },
      });
    }

    await db.user.update({
      where: {
        address: address,
      },
      data: {
        connected: connected === "true",
      },
    });

    console.log("[login] user:", user);
  } catch (error) {
    console.log("[login] User not found. Creating new user");

    await db.user.create({
      data: {
        address,
      },
    });
  }

  session.set("address", address);

  return redirect(`/dashboard`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Login() {
  const submit = useSubmit();

  const handleLoginWalletConnect = async () => {
    console.log(
      "[browser][handleLoginWalletConnect] Waiting connection with walletConnect ..."
    );

    // bridge url
    const bridge = "https://bridge.walletconnect.org";

    // create new connector
    const connector: WalletConnect = new WalletConnect({
      bridge, // Required
      qrcodeModal: QRCodeModal,
    });

    // check if already connected
    if (!connector.connected) {
      console.log("[browser][handleLoginWalletConnect] Creating session ...");
      // create new session
      await connector.createSession();
    } else {
      console.log("[browser][handleLoginWalletConnect] connector:", connector);

      const address = connector.accounts[0];

      console.log("[browser][handleLoginWalletConnect] address:", address);

      const formData = new FormData();

      formData.append("address", address);
      formData.append("connected", "true");

      submit(formData, {
        action: "/login/?index",
        method: "post",
        encType: "application/x-www-form-urlencoded",
        replace: true,
      });
    }

    // subscribe to events and submit form
    subscribeToEvents(connector, submit);
  };

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
          <Button
            backgroundColor={"#1E7EFD"}
            width="350px"
            height="70px"
            color="white"
            rounded={"full"}
            fontSize="23px"
            onClick={handleLoginWalletConnect}
          >
            Wallet Connect
          </Button>
        </Center>
      </Box>
    </Box>
  );
}
