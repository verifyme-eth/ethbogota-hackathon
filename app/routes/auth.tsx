import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { GraphQLClient } from "graphql-request";
import { GetChallengue } from "~/web3/lens/lens-api";

import { commitSession, getSession } from "~/bff/session";

import authenticateInLens from "~/web3/lens/authenticate";
import type { AuthenticationResult } from "~/web3/lens/lens-api.response";

import LensAuth from "~/components/LensButton";
import { Box, Text } from "@chakra-ui/react";

export const loader: LoaderFunction = async ({ request }) => {
  // Get address from cookie session
  const session = await getSession(request.headers.get("Cookie"));

  const addressSession = session.get("address");
  const accessToken = session.get("accessToken");
  const refreshToken = session.get("refreshToken");

  // Start challenge with Lens API
  const lens = new GraphQLClient("https://api.lens.dev/playground");

  // Get default profile from Lens
  const variables: any = {
    request: { address: addressSession },
  };

  const challengeResponse = await lens.request(GetChallengue, variables);

  const challengeText = challengeResponse.challenge.text;

  let authenticated = false;

  if (!accessToken && !refreshToken) {
    authenticated = true;
  }

  return { challengeText, addressSession, authenticated };
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const address = session.get("address");

  const form = await request.formData();

  const signature = form.get("signature");

  if (!signature || typeof signature !== "string") return null;

  const authResponse: AuthenticationResult = await authenticateInLens(
    address,
    signature
  );

  session.set("accessToken", authResponse.authenticate.accessToken);
  session.set("refreshToken", authResponse.authenticate.refreshToken);

  return redirect(`/auth`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Auth() {
  const { addressSession, challengeText, authenticated } = useLoaderData();

  return authenticated ? (
    <LensAuth address={addressSession} challengeText={challengeText} />
  ) : (
    <Box>
      <Text> Estas autenticado </Text>
    </Box>
  );
}
