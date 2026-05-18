import { AppKit, BridgeChain } from "@circle-fin/app-kit";
import type { BridgeParams } from "@circle-fin/app-kit";
import { createViemAdapterFromPrivateKey } from "@circle-fin/adapter-viem-v2";
import { inspect } from "node:util";
import { isAddress } from "viem";

const requiredEnv = [
  "APPKIT_BRIDGE_PRIVATE_KEY",
  "APPKIT_BRIDGE_FROM_CHAIN",
  "APPKIT_BRIDGE_TO_CHAIN",
  "APPKIT_BRIDGE_RECIPIENT_ADDRESS",
  "APPKIT_BRIDGE_AMOUNT",
] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

const privateKey = process.env.APPKIT_BRIDGE_PRIVATE_KEY as string;
const fromChainRaw = process.env.APPKIT_BRIDGE_FROM_CHAIN as string;
const toChainRaw = process.env.APPKIT_BRIDGE_TO_CHAIN as string;
const recipientAddress = process.env.APPKIT_BRIDGE_RECIPIENT_ADDRESS as string;
const amount = process.env.APPKIT_BRIDGE_AMOUNT as string;
const token = (process.env.APPKIT_BRIDGE_TOKEN ?? "USDC").toUpperCase();
const dryRun =
  (process.env.APPKIT_BRIDGE_DRY_RUN ?? "true").toLowerCase() !== "false";

if (!privateKey.startsWith("0x") || privateKey.length !== 66) {
  throw new Error(
    "APPKIT_BRIDGE_PRIVATE_KEY must be a 0x-prefixed 32-byte hex private key",
  );
}

if (!isAddress(recipientAddress)) {
  throw new Error("APPKIT_BRIDGE_RECIPIENT_ADDRESS must be a valid EVM address");
}

if (Number.isNaN(Number(amount)) || Number(amount) <= 0) {
  throw new Error(
    "APPKIT_BRIDGE_AMOUNT must be a positive numeric string, e.g. 0.01",
  );
}

if (token !== "USDC") {
  throw new Error(
    `APPKIT_BRIDGE_TOKEN must be USDC for App Kit Bridge. Received: ${token}`,
  );
}

function parseBridgeChain(value: string, envName: string): BridgeChain {
  if (Object.values(BridgeChain).includes(value as BridgeChain)) {
    return value as BridgeChain;
  }

  throw new Error(
    `${envName} is not a supported BridgeChain value: ${value}. Check App Kit BridgeChain enum values.`,
  );
}

const fromChain = parseBridgeChain(fromChainRaw, "APPKIT_BRIDGE_FROM_CHAIN");
const toChain = parseBridgeChain(toChainRaw, "APPKIT_BRIDGE_TO_CHAIN");

const kit = new AppKit();

async function main(): Promise<void> {
  const sourceAdapter = createViemAdapterFromPrivateKey({
    privateKey,
  });

  const destinationAdapter = createViemAdapterFromPrivateKey({
    privateKey,
  });

  const bridgeParams: BridgeParams = {
    from: { adapter: sourceAdapter, chain: fromChain },
    to: {
      adapter: destinationAdapter,
      chain: toChain,
      recipientAddress,
    },
    amount,
    token: "USDC",
  };

  console.log("[appkit-bridge-usdc-to-arc] configuration:");
  console.log(`- source chain: ${fromChain}`);
  console.log(`- destination chain: ${toChain}`);
  console.log(`- recipient: ${recipientAddress}`);
  console.log(`- amount: ${amount}`);
  console.log("- token: USDC");
  console.log(`- dry-run mode: ${dryRun}`);

  try {
    const estimate = await kit.estimateBridge(bridgeParams);
    console.log("[appkit-bridge-usdc-to-arc] estimate:");
    console.log(inspect(estimate, false, null, true));
  } catch (error) {
    console.error("[appkit-bridge-usdc-to-arc] estimate failed:");
    console.error(inspect(error, false, null, true));
    throw new Error(
      "Bridge estimate failed. Possible causes include unsupported chain/token combination or insufficient source-chain balance/gas.",
    );
  }

  if (dryRun) {
    console.log("DRY RUN ENABLED. No bridge transaction sent.");
    return;
  }

  console.log(
    "[appkit-bridge-usdc-to-arc] APPKIT_BRIDGE_DRY_RUN=false. Attempting live bridge operation...",
  );

  try {
    const result = await kit.bridge(bridgeParams);
    console.log("[appkit-bridge-usdc-to-arc] bridge result:");
    console.log(inspect(result, false, null, true));
  } catch (error) {
    console.error("[appkit-bridge-usdc-to-arc] bridge failed:");
    console.error(inspect(error, false, null, true));
    throw new Error(
      "Bridge execution failed. Verify supported chain/token path and ensure source wallet has required USDC and native gas.",
    );
  }
}

void main();