import { GraphQLClient } from "graphql-request";

import { Authenticate } from "./lens-api";
import type { AuthenticationResult } from "./lens-api.response";

import type { SignedAuthChallenge } from "./lens-api.types";

export default async function authenticateInLens(
  address: string,
  signature: string
) {
  const lens = new GraphQLClient("https://api.lens.dev/playground");

  const variables: SignedAuthChallenge = {
    request: {
      address: address,
      signature: signature,
    },
  };

  const result: AuthenticationResult = await lens.request(
    Authenticate,
    variables
  );

  return result;
}
