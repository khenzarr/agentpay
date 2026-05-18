import { AppKit, UnifiedBalanceChain } from "@circle-fin/app-kit";
import type { SpendParams } from "@circle-fin/app-kit";
import { createViemAdapterFromPrivateKey } from "@circle-fin/adapter-viem-v2";
import { inspect } from "node:util";
import { isAddress } from "viem";

const requiredEnv = [
  "APPKIT_UB_PRIVATE_KEY",
  "APPKIT_UB_RECIPIENT_ADDRESS",
  "APPKIT_UB_AMOUNT",
] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

const privateKey = process.env.APPKIT_UB_PRIVATE_KEY as string;
const sourceChainRaw = process.env.APPKIT_UB_SOURCE_CHAINS ?? "Ethereum_Sepolia";
const destinationChainRaw =
  process.env.APPKIT_UB_DESTINATION_CHAIN ?? "Arc_Testnet";
const recipientAddress = process.env.APPKIT_UB_RECIPIENT_ADDRESS as string;
const amount = process.env.APPKIT_UB_AMOUNT as string;
const token = (process.env.APPKIT_UB_TOKEN ?? "USDC").toUpperCase();
const dryRun = (process.env.APPKIT_UB_DRY_RUN ?? "true").toLowerCase() !== "false";
const useForwarder =
  (process.env.APPKIT_UB_USE_FORWARDER ?? "true").toLowerCase() !== "false";

if (!privateKey.startsWith("0x") || privateKey.length !== 66) {
  throw new Error(
    "APPKIT_UB_PRIVATE_KEY must be a 0x-prefixed 32-byte hex private key",
  );
}

if (!isAddress(recipientAddress)) {
  throw new Error("APPKIT_UB_RECIPIENT_ADDRESS must be a valid EVM address");
}

if (Number.isNaN(Number(amount)) || Number(amount) <= 0) {
  throw new Error("APPKIT_UB_AMOUNT must be a positive numeric string, e.g. 0.01");
}

if (token !== "USDC") {
  throw new Error(`APPKIT_UB_TOKEN must be USDC. Received: ${token}`);
}

if (!useForwarder) {
  throw new Error(
    "APPKIT_UB_USE_FORWARDER=false is not supported by this script. Unified Balance spend destination must either set useForwarder=true or provide to.adapter.",
  );
}

function classifyEstimateError(error: unknown): {
  category:
    | "invalid params"
    | "insufficient Unified Balance"
    | "unsupported route"
    | "missing gas/funds"
    | "unknown";
  reason: string;
} {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : inspect(error, false, null, false);
  const lower = message.toLowerCase();

  if (
    lower.includes("input_validation_failed") ||
    lower.includes("invalid parameters") ||
    lower.includes("invalid input")
  ) {
    return {
      category: "invalid params",
      reason:
        "Spend params did not satisfy SDK validation (e.g., destination must use forwarder or provide adapter).",
    };
  }

  if (
    lower.includes("insufficient") &&
    (lower.includes("balance") || lower.includes("unified balance"))
  ) {
    return {
      category: "insufficient Unified Balance",
      reason: "Unified Balance does not have enough USDC for requested amount/fees.",
    };
  }

  if (
    lower.includes("unsupported") ||
    lower.includes("route") ||
    lower.includes("not supported")
  ) {
    return {
      category: "unsupported route",
      reason: "Chain/token/forwarder route is not currently supported by the provider.",
    };
  }

  if (
    lower.includes("gas") ||
    lower.includes("funds") ||
    lower.includes("native") ||
    lower.includes("allowance")
  ) {
    return {
      category: "missing gas/funds",
      reason: "Source chain may be missing native gas or required token funds/allowance.",
    };
  }

  return {
    category: "unknown",
    reason: "Unclassified SDK/provider error. Inspect structured error output.",
  };
}

function parseUnifiedBalanceChain(
  value: string,
  envName: string,
): UnifiedBalanceChain {
  if (Object.values(UnifiedBalanceChain).includes(value as UnifiedBalanceChain)) {
    return value as UnifiedBalanceChain;
  }

  throw new Error(
    `${envName} is not a supported UnifiedBalanceChain value: ${value}`,
  );
}

function parseSourceChains(raw: string): UnifiedBalanceChain[] {
  const chains = raw
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
    .map((value) =>
      parseUnifiedBalanceChain(value, "APPKIT_UB_SOURCE_CHAINS"),
    );

  if (chains.length === 0) {
    throw new Error(
      "APPKIT_UB_SOURCE_CHAINS must include at least one UnifiedBalanceChain value",
    );
  }

  return chains;
}

const sourceChains = parseSourceChains(sourceChainRaw);
const destinationChain = parseUnifiedBalanceChain(
  destinationChainRaw,
  "APPKIT_UB_DESTINATION_CHAIN",
);

const kit = new AppKit();

async function main(): Promise<void> {
  const adapter = createViemAdapterFromPrivateKey({ privateKey });

  const allocations = sourceChains.map((chain) => ({
    chain,
    amount: (Number(amount) / sourceChains.length).toString(),
  }));

  const spendParams: SpendParams = {
    from: {
      adapter,
      allocations: sourceChains.length === 1 ? allocations[0] : allocations,
    },
    to: {
      chain: destinationChain,
      recipientAddress,
      useForwarder,
    },
    amount,
    token: "USDC",
  };

  console.log("[appkit-unified-balance-spend-to-arc] configuration:");
  console.log(`- source chains: ${sourceChains.join(", ")}`);
  console.log(`- destination chain: ${destinationChain}`);
  console.log(`- recipient: ${recipientAddress}`);
  console.log(`- amount: ${amount}`);
  console.log("- token: USDC");
  console.log(`- use forwarder: ${useForwarder}`);
  console.log(`- dry-run mode: ${dryRun}`);

  let estimate;
  try {
    estimate = await kit.unifiedBalance.estimateSpend(spendParams);
    console.log("[appkit-unified-balance-spend-to-arc] estimate:");
    console.log(inspect(estimate, false, null, true));
  } catch (error) {
    const classification = classifyEstimateError(error);
    console.error("[appkit-unified-balance-spend-to-arc] estimate failed:");
    console.error(inspect(error, false, null, true));
    console.error("[appkit-unified-balance-spend-to-arc] estimate error classification:");
    console.error(
      inspect(
        {
          category: classification.category,
          reason: classification.reason,
        },
        false,
        null,
        true,
      ),
    );
    throw new Error(
      `Unified Balance estimate failed [${classification.category}]: ${classification.reason}`,
    );
  }

  if (dryRun) {
    console.log(
      "[appkit-unified-balance-spend-to-arc] DRY RUN ENABLED. No live spend executed.",
    );
    return;
  }

  console.log(
    "[appkit-unified-balance-spend-to-arc] APPKIT_UB_DRY_RUN=false. Attempting live Unified Balance spend...",
  );

  const result = await kit.unifiedBalance.spend(spendParams);
  console.log("[appkit-unified-balance-spend-to-arc] spend result:");
  console.log(inspect(result, false, null, true));
}

void main();
