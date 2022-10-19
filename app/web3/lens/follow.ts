import { GraphQLClient } from "graphql-request";

import { getAddressFromSigner } from "../ethers.service";
import { CreateFollowDataType } from "./lens-api";

import type FollowRequest from "./lens-api.types";

async function createFollowTypedData() {
  const lens = new GraphQLClient("https://api.lens.dev/playground");

  const variables: FollowRequest = {
    request: { follow: [{ profile: "0x01" }] },
  };

  const result = await lens.request(CreateFollowDataType, variables);

  return result.data!.createFollowTypedData;
}

async function follow(profileId: string = "0x01") {
  const address = getAddressFromSigner();
  console.log("follow: address", address);

  const result = await createFollowTypedData();

  console.log("follow: result", result);
}
