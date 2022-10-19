import { GraphQLClient } from "graphql-request";

import { getAddressFromSigner } from "../ethers.service";
import { CreateFollowDataType } from "./lens-api";

import type { FollowRequest } from "./lens-api.types";

async function createFollowTypedData(profileId: string, accessToken: string) {
  const lens = new GraphQLClient("https://api.lens.dev/playground");

  const variables: FollowRequest = {
    request: { follow: [{ profile: profileId }] },
  };

  lens.setHeaders({
    "x-access-token": `Bearer ${accessToken}`,
  });

  const result = await lens.request(CreateFollowDataType, variables);

  return result;
}

async function follow(profileId: string = "0x01", accessToken: string) {
  const address = getAddressFromSigner();
  console.log("follow: address", address);

  const result = await createFollowTypedData(profileId, accessToken);

  console.log("follow: result", result);
}

export { createFollowTypedData, follow };
