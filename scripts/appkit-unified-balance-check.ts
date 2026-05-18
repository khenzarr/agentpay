import { AppKit } from "@circle-fin/app-kit";
import { createViemAdapterFromPrivateKey } from "@circle-fin/adapter-viem-v2";
import { inspect } from "node:util";

const requiredEnv = ["APPKIT_UB_PRIVATE_KEY"] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

const privateKey = process.env.APPKIT_UB_PRIVATE_KEY as string;
const token = (process.env.APPKIT_UB_TOKEN ?? "USDC").toUpperCase();
const includePending =
  (process.env.APPKIT_UB_INCLUDE_PENDING ?? "true").toLowerCase() !== "false";

if (!privateKey.startsWith("0x") || privateKey.length !== 66) {
  throw new Error(
    "APPKIT_UB_PRIVATE_KEY must be a 0x-prefixed 32-byte hex private key",
  );
}

if (token !== "USDC") {
  throw new Error(`APPKIT_UB_TOKEN must be USDC. Received: ${token}`);
}

const kit = new AppKit();

async function main(): Promise<void> {
  const adapter = createViemAdapterFromPrivateKey({ privateKey });

  console.log("[appkit-unified-balance-check] configuration:");
  console.log(`- token: ${token}`);
  console.log(`- include pending: ${includePending}`);

  const supportedChains = kit.unifiedBalance.getSupportedChains("USDC");
  console.log("[appkit-unified-balance-check] supported chains for USDC:");
  console.log(
    inspect(
      supportedChains.map((chain) => ({
        name: chain.name,
        isTestnet: chain.isTestnet,
      })),
      false,
      null,
      true,
    ),
  );

  const balances = await kit.unifiedBalance.getBalances({
    token: "USDC",
    sources: { adapter },
    includePending,
    networkType: "testnet",
  });

  console.log("[appkit-unified-balance-check] balances:");
  console.log(inspect(balances, false, null, true));
}

void main();
