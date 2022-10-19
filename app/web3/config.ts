const getParamOrExit = (name: string) => {
  const param = process.env[name];
  if (!param) {
    console.error(`Required config param '${name}' missing`);
    process.exit(1);
  }
  return param;
};

export const PK = getParamOrExit("PK");

export const MUMBAI_RPC_URL = getParamOrExit("MUMBAI_RPC_URL");
