import fs from "fs";
import path from "path";

const fileLensHub = fs.readFileSync(
  path.join(__dirname, "abis/lens-hub-contract-abi.json"),
  "utf8"
);

export const PK =
  "544c3100122ea42b630ada035a18969a7faadc01df2ffc5834201c827f53bf4a";

export const MUMBAI_RPC_URL = "https://rpc-mumbai.matic.today";

export const LENS_HUB_CONTRACT = "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82";

export const LENS_HUB_ABI = JSON.parse(fileLensHub);
