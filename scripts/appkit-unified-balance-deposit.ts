import { AppKit, UnifiedBalanceChain } from "@circle-fin/app-kit";
import { createViemAdapterFromPrivateKey } from "@circle-fin/adapter-viem-v2";
import { inspect } from "node:util";
import { privateKeyToAccount } from "viem/accounts";
import { isAddress } from "viem";

const requiredEnv = ["APPKIT_UB_DEPOSIT_PRIVATE_KEY"] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

const privateKey = process.env.APPKIT_UB_DEPOSIT_PRIVATE_KEY as string;
const chainRaw = process.env.APPKIT_UB_DEPOSIT_CHAIN ?? "Ethereum_Sepolia";
const amount = process.env.APPKIT_UB_DEPOSIT_AMOUNT ?? "0.01";
const token = (process.env.APPKIT_UB_DEPOSIT_TOKEN ?? "USDC").toUpperCase();
const dryRun =
  (process.env.APPKIT_UB_DEPOSIT_DRY_RUN ?? "true").toLowerCase() !== "false";
const depositAccount = process.env.APPKIT_UB_DEPOSIT_ACCOUNT;

if (!privateKey.startsWith("0x") || privateKey.length !== 66) {
  throw new Error(
    "APPKIT_UB_DEPOSIT_PRIVATE_KEY must be a 0x-prefixed 32-byte hex private key",
  );
}

if (Number.isNaN(Number(amount)) || Number(amount) <= 0) {
  throw new Error(
    "APPKIT_UB_DEPOSIT_AMOUNT must be a positive numeric string, e.g. 0.01",
  );
}

if (token !== "USDC") {
  throw new Error(`APPKIT_UB_DEPOSIT_TOKEN must be USDC. Received: ${token}`);
}

if (depositAccount && !isAddress(depositAccount)) {
  throw new Error("APPKIT_UB_DEPOSIT_ACCOUNT must be a valid EVM address");
}

function parseUnifiedBalanceChain(value: string): UnifiedBalanceChain {
  if (Object.values(UnifiedBalanceChain).includes(value as UnifiedBalanceChain)) {
    return value as UnifiedBalanceChain;
  }

  throw new Error(`APPKIT_UB_DEPOSIT_CHAIN is not supported: ${value}`);
}

const chain = parseUnifiedBalanceChain(chainRaw);
const kit = new AppKit();

async function main(): Promise<void> {
  const adapter = createViemAdapterFromPrivateKey({ privateKey });
  const depositorAddress = privateKeyToAccount(privateKey as `0x${string}`).address;

  console.log("[appkit-unified-balance-deposit] configuration:");
  console.log(`- depositor: ${depositorAddress}`);
  console.log(`- chain: ${chain}`);
  console.log(`- amount: ${amount}`);
  console.log("- token: USDC");
  console.log(`- dry-run mode: ${dryRun}`);
  console.log(
    `- deposit mode: ${depositAccount ? "depositFor" : "deposit (self)"}`,
  );
  if (depositAccount) {
    console.log(`- deposit account: ${depositAccount}`);
  }

  if (dryRun) {
    console.log(
      "[appkit-unified-balance-deposit] DRY RUN ENABLED. No live deposit executed.",
    );
    console.log("[appkit-unified-balance-deposit] intended params:");
    console.log(
      inspect(
        {
          from: { adapter: "<private-key-adapter>", chain },
          amount,
          token: "USDC",
          ...(depositAccount ? { depositAccount } : {}),
        },
        false,
        null,
        true,
      ),
    );
    return;
  }

  console.log(
    "[appkit-unified-balance-deposit] APPKIT_UB_DEPOSIT_DRY_RUN=false. Attempting live Unified Balance deposit...",
  );

  const result = depositAccount
    ? await kit.unifiedBalance.depositFor({
        from: { adapter, chain },
        amount,
        token: "USDC",
        depositAccount,
      })
    : await kit.unifiedBalance.deposit({
        from: { adapter, chain },
        amount,
        token: "USDC",
      });

  console.log("[appkit-unified-balance-deposit] deposit result:");
  console.log(inspect(result, false, null, true));
}

void main();
