import type { SubmitFunction } from "@remix-run/react";

import type WalletConnect from "@walletconnect/client";
import type { IInternalEvent } from "@walletconnect/types";
import { convertUtf8ToHex } from "@walletconnect/utils";

import { hashMessage } from "ethers/lib/utils";

function onConnect(payload: IInternalEvent): string {
  const { accounts } = payload.params[0];

  const address = accounts[0];

  return address;
}

function onSessionUpdate(payload: IInternalEvent): string {
  const { accounts } = payload.params[0];

  const address = accounts[0];

  return address;
}

export async function subscribeToEvents(
  connector: WalletConnect,
  submit: SubmitFunction
): Promise<any> {
  connector.on("session_update", (error, payload) => {
    if (error) {
      throw error;
    }

    console.log("[blockchain][walletConnect] event 'session_update'", payload);

    const address = onSessionUpdate(payload);

    return address;
  });

  connector.on("connect", (error, payload) => {
    if (error) {
      throw error;
    }

    console.log("[blockchain][walletConnect] event 'connect'", payload);

    const address = onConnect(payload);

    const formData = new FormData();

    formData.append("address", address);
    formData.append("connected", "true");

    submit(formData, {
      action: "/login/?index",
      method: "post",
      encType: "application/x-www-form-urlencoded",
      replace: true,
    });

    return address;
  });

  connector.on("disconnect", (error, payload) => {
    if (error) {
      throw error;
    }

    console.log("disconnect", payload);
  });
}

export async function standardSignMessage(
  connector: WalletConnect,
  address: string,
  message: string
) {
  // encode message (hex)
  // const hexMesg = convertUtf8ToHex(message);

  // eth_sign params
  const msgParams = [address, message];

  try {
    // send message
    const result = await connector.signMessage(msgParams);

    // verify signature
    const hash = hashMessage(message);
    // const valid = await verifySignature(address, result, hash, chainId);

    // // format displayed result
    // const formattedResult = {
    //   method: "eth_sign (standard)",
    //   address,
    //   valid,
    //   result,
    // };
  } catch (error) {
    console.error(error);
  }
}

export async function personalSignMessage(
  connector: WalletConnect,
  address: string,
  message: string
) {
  // encode message (hex)
  const hexMesg = convertUtf8ToHex(message);

  // personal_sign params
  const msgParams = [hexMesg, address];

  try {
    // send message
    const signature = await connector.signPersonalMessage(msgParams);

    // format displayed result
    const formattedResult = {
      method: "personal_sign",
      address: address,
      signature: signature,
    };

    return formattedResult;
  } catch (error) {
    console.error(error);
  }
}

export async function signTypeDataWithWalletConnect(
  connector: WalletConnect,
  address: string,
  typedData: string
) {
  // conso

  console.log("pasa por aca");
  console.log(typedData);

  // eth_signTypedData params
  const msgParams = [address, typedData];

  try {
    // sign typed data
    console.log("aca se rompoe");
    const result = await connector.signTypedData(msgParams);

    console.log(result);

    // format displayed result
    const formattedResult = {
      method: "eth_signTypedData",
      address: address,
      result: result,
    };

    return formattedResult;
  } catch (error) {
    console.error(error);
  }
}
