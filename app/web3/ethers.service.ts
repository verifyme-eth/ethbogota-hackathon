import { ethers, utils, Wallet } from "ethers";
import type { TypedDataDomain } from "ethers";

import { MUMBAI_RPC_URL, PK } from "./config";

import { omit } from "~/utils/helpers";

export const ethersProvider = new ethers.providers.JsonRpcProvider(
  MUMBAI_RPC_URL
);

export const getSigner = () => {
  return new Wallet(PK, ethersProvider);
};

export const getAddressFromSigner = () => {
  return getSigner().address;
};

export const signedTypeData = (
  domain: TypedDataDomain,
  types: Record<string, any>,
  value: Record<string, any>
) => {
  const signer = getSigner();

  // remove the __typedname from the signature!
  return signer._signTypedData(
    omit(domain, "__typename"),
    omit(types, "__typename"),
    omit(value, "__typename")
  );
};

export const splitSignature = (signature: string) => {
  return utils.splitSignature(signature);
};
