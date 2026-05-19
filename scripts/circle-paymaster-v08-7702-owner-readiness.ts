import { privateKeyToAccount } from "viem/accounts";
import { isAddress } from "viem";

type AllowedEnvKey =
  | "PAYMASTER_7702_OWNER_PRIVATE_KEY"
  | "PAYMASTER_7702_OWNER_EXPECTED_ADDRESS"
  | "PAYMASTER_7702_OWNER_DRY_RUN";

const ALLOWED_ENV_KEYS: AllowedEnvKey[] = [
  "PAYMASTER_7702_OWNER_PRIVATE_KEY",
  "PAYMASTER_7702_OWNER_EXPECTED_ADDRESS",
  "PAYMASTER_7702_OWNER_DRY_RUN",
];

function readEnv(key: AllowedEnvKey): string {
  return process.env[key]?.trim() ?? "";
}

function parseDryRun(value: string): boolean {
  if (!value) return true;
  return value.toLowerCase() !== "false";
}

function isValidPrivateKey(value: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(value);
}

function isObviousPlaceholderPrivateKey(value: string): boolean {
  const normalized = value.toLowerCase();

  if (normalized === "0x" + "0".repeat(64)) return true;

  const noPrefix = normalized.startsWith("0x") ? normalized.slice(2) : normalized;
  const placeholderTokens = [
    "replace",
    "placeholder",
    "example",
    "your",
    "private_key",
    "changeme",
    "dummy",
    "test",
  ];

  return placeholderTokens.some((token) => noPrefix.includes(token));
}

function main(): void {
  console.log("[circle-paymaster-v08-7702-owner-readiness] mode=SERVER_ONLY_DRY_RUN");
  console.log("networkCalls=false");
  console.log("signing=false");
  console.log("userOps=false");
  console.log("transactions=false");

  const env = Object.fromEntries(ALLOWED_ENV_KEYS.map((key) => [key, readEnv(key)])) as Record<
    AllowedEnvKey,
    string
  >;

  const dryRun = parseDryRun(env.PAYMASTER_7702_OWNER_DRY_RUN);
  if (!dryRun) {
    throw new Error("PAYMASTER_7702_OWNER_DRY_RUN must be true in this readiness sprint");
  }

  const ownerPrivateKey = env.PAYMASTER_7702_OWNER_PRIVATE_KEY;
  const expectedAddressRaw = env.PAYMASTER_7702_OWNER_EXPECTED_ADDRESS;

  if (expectedAddressRaw && !isAddress(expectedAddressRaw)) {
    throw new Error("PAYMASTER_7702_OWNER_EXPECTED_ADDRESS must be a valid EVM address");
  }

  if (!ownerPrivateKey) {
    console.log("\n[owner]");
    console.log("ownerAddressPresent=no");
    console.log("expectedAddressMatched=unknown");
    console.log("instruction=Set PAYMASTER_7702_OWNER_PRIVATE_KEY in .env.circle.local (test-only)");
    console.log("instruction=Optionally set PAYMASTER_7702_OWNER_EXPECTED_ADDRESS for mismatch guardrail");

    console.log("\n[status]");
    console.log("signing=false");
    console.log("networkCalls=false");
    console.log("userOps=false");
    console.log("paymasterStatus=NOT_CLAIMED");
    console.log("gaslessStatus=NOT_CLAIMED");
    return;
  }

  if (!isValidPrivateKey(ownerPrivateKey)) {
    throw new Error(
      "PAYMASTER_7702_OWNER_PRIVATE_KEY must be a 0x-prefixed 32-byte hex private key",
    );
  }

  if (isObviousPlaceholderPrivateKey(ownerPrivateKey)) {
    throw new Error("PAYMASTER_7702_OWNER_PRIVATE_KEY looks like a placeholder and is rejected");
  }

  const ownerAccount = privateKeyToAccount(ownerPrivateKey as `0x${string}`);
  const ownerAddress = ownerAccount.address;

  let expectedAddressMatched: "yes" | "no" | "unknown" = "unknown";
  if (expectedAddressRaw) {
    expectedAddressMatched =
      ownerAddress.toLowerCase() === expectedAddressRaw.toLowerCase() ? "yes" : "no";

    if (expectedAddressMatched === "no") {
      throw new Error("Derived owner address does not match PAYMASTER_7702_OWNER_EXPECTED_ADDRESS");
    }
  }

  console.log("\n[owner]");
  console.log("ownerAddressPresent=yes");
  console.log(`ownerAddress=${ownerAddress}`);
  console.log(`expectedAddressMatched=${expectedAddressMatched}`);

  console.log("\n[status]");
  console.log("signing=false");
  console.log("networkCalls=false");
  console.log("userOps=false");
  console.log("paymasterStatus=NOT_CLAIMED");
  console.log("gaslessStatus=NOT_CLAIMED");
}

main();
