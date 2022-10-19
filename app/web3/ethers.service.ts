import { ethers, Wallet } from "ethers";

import { MUMBAI_RPC_URL, PK } from "./config";

export const ethersProvider = new ethers.providers.JsonRpcProvider(
  MUMBAI_RPC_URL
);

export const getSigner = () => {
  return new Wallet(PK, ethersProvider);
};

export const getAddressFromSigner = () => {
  return getSigner().address;
};
