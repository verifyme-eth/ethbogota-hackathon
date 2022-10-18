import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { GraphQLClient } from "graphql-request";

import { getSession } from "~/bff/session";

import LensAuth from "~/components/LensButton";
import { GetChallengue } from "~/web3/lens";

export const loader: LoaderFunction = async ({ request }) => {
  // Get address from cookie session
  const session = await getSession(request.headers.get("Cookie"));

  const address = session.get("address");

  // Start challenge with Lens API
  const lens = new GraphQLClient("https://api.lens.dev/playground");

  // Get default profile from Lens
  const variables: any = {
    request: { address: address },
  };

  const challengeResponse = await lens.request(GetChallengue, variables);

  const challengeText = challengeResponse.challenge.text;

  return { challengeText };
};

export default function Auth() {
  const { challengeText } = useLoaderData();

  return <LensAuth />;
}
