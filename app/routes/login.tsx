import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useSubmit, useTransition } from "@remix-run/react";

import { db } from "~/utils/db.server";

import { commitSession, getSession } from "~/bff/session";

import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

import { Center, Text, Box, Image, Button, Flex } from "@chakra-ui/react";
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
  const transition = useTransition();

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
      <Box pt={10}>
        <Center>
          <Image src="./assets/LogoCompleto.png" width="50%" />
        </Center>
      </Box>

      {transition.state === "idle" && (
        <>
          <Box>
            <Center p={6}>
              <Text
                fontSize="30px"
                fontWeight={700}
                mt="30"
                color="primary"
                align="center"
                pb={5}
              >
                The verification{" "}
                <Text as="span" color="#71AA43">
                  for everyone
                </Text>
              </Text>
            </Center>
          </Box>

          <Box>
            <Center>
              <Box boxSize="170px">
                <Image src="./assets/Cuadrados.png" />
              </Box>
            </Center>
          </Box>

          <Box pt={10}>
            <Center>
              <Button
                backgroundColor="#1E7EFD"
                width="250px"
                height="65px"
                color="white"
                rounded="full"
                fontSize="18px"
                onClick={handleLoginWalletConnect}
              >
                <Flex pr="20px" flex="">
                  <Image src="./assets/walletcon.png" />
                </Flex>
                Wallet Connect
              </Button>
            </Center>
          </Box>
        </>
      )}

      {transition.state === "loading" && (
        <Box>
          <Text textAlign="center" fontSize="26px" color="lensDark" mt="25px">
            Connecting with garden
          </Text>

          <Center>
            <Box mt="20px">
              <Image src="./assets/lens-loading.gif" rounded="2xl" />
            </Box>
          </Center>
        </Box>
      )}
    </Box>
  );
}
