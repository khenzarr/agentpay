import { AppKit } from "@circle-fin/app-kit";
import { createViemAdapterFromPrivateKey } from "@circle-fin/adapter-viem-v2";
import type { SendParams } from "@circle-fin/app-kit";
import { inspect } from "node:util";
import { isAddress } from "viem";

const requiredEnv = [
  "APPKIT_PRIVATE_KEY",
  "APPKIT_RECIPIENT_ADDRESS",
  "APPKIT_AMOUNT",
] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

const privateKey = process.env.APPKIT_PRIVATE_KEY as string;
const recipientAddress = process.env.APPKIT_RECIPIENT_ADDRESS as string;
const amount = process.env.APPKIT_AMOUNT as string;
const dryRun = (process.env.APPKIT_DRY_RUN ?? "true").toLowerCase() !== "false";

if (!privateKey.startsWith("0x") || privateKey.length !== 66) {
  throw new Error("APPKIT_PRIVATE_KEY must be a 0x-prefixed 32-byte hex private key");
}

if (!isAddress(recipientAddress)) {
  throw new Error("APPKIT_RECIPIENT_ADDRESS must be a valid EVM address");
}

if (Number.isNaN(Number(amount)) || Number(amount) <= 0) {
  throw new Error("APPKIT_AMOUNT must be a positive numeric string, e.g. 1.00");
}

const kit = new AppKit();

async function main(): Promise<void> {
  const adapter = createViemAdapterFromPrivateKey({
    privateKey,
  });

  const sendParams: SendParams = {
    from: { adapter, chain: "Arc_Testnet" },
    to: recipientAddress,
    amount,
    token: "USDC",
  };

  const estimate = await kit.estimateSend(sendParams);

  console.log("[appkit-send-arc-usdc] estimate:");
  console.log(inspect(estimate, false, null, true));

  if (dryRun) {
    console.log(
      "[appkit-send-arc-usdc] DRY RUN ENABLED (APPKIT_DRY_RUN!=false). No transaction sent.",
    );
    return;
  }

  const result = await kit.send(sendParams);
  console.log("[appkit-send-arc-usdc] send result:");
  console.log(inspect(result, false, null, true));
}

void main();
