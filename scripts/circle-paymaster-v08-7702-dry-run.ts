export {};

type RequiredEnvKey =
  | "ARC_BUNDLER_RPC_URL"
  | "RAW_ERC4337_ENTRYPOINT_VERSION"
  | "RAW_ERC4337_ENTRYPOINT_ADDRESS"
  | "CIRCLE_PAYMASTER_ADDRESS"
  | "RAW_ERC4337_DRY_RUN";

const REQUIRED_ENV_KEYS: RequiredEnvKey[] = [
  "ARC_BUNDLER_RPC_URL",
  "RAW_ERC4337_ENTRYPOINT_VERSION",
  "RAW_ERC4337_ENTRYPOINT_ADDRESS",
  "CIRCLE_PAYMASTER_ADDRESS",
  "RAW_ERC4337_DRY_RUN",
];

const DEFAULTS = {
  chainId: 5042002,
  rpc: "https://rpc.testnet.arc.network",
  paymasterVersion: "v0.8",
  paymasterAddress: "0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966",
  expectedAccountPath: "toSimple7702SmartAccount",
  proofPath: "sendUserOperation + waitForUserOperationReceipt",
} as const;

function readEnv(key: string): string {
  return process.env[key]?.trim() ?? "";
}

function isPresent(value: string): boolean {
  return value.length > 0;
}

function isHexAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

function asBoolean(value: string, fallback: boolean): boolean {
  if (!value) return fallback;
  return value.toLowerCase() !== "false";
}

function main(): void {
  console.log("[circle-paymaster-v08-7702-dry-run] mode=NON_MUTATING_ARCHITECTURE_ONLY");
  console.log("networkCalls=false");
  console.log("walletCreation=false");
  console.log("permitSigning=false");
  console.log("sendUserOperation=false");
  console.log("bundlerSubmission=false");
  console.log("tokenTransfer=false");

  const values = Object.fromEntries(REQUIRED_ENV_KEYS.map((key) => [key, readEnv(key)])) as Record<RequiredEnvKey, string>;

  const present = REQUIRED_ENV_KEYS.filter((key) => isPresent(values[key]));
  const missing = REQUIRED_ENV_KEYS.filter((key) => !isPresent(values[key]));

  const entryPointVersion = values.RAW_ERC4337_ENTRYPOINT_VERSION || "v0.8";
  const entryPointAddress = values.RAW_ERC4337_ENTRYPOINT_ADDRESS;
  const paymasterAddress = values.CIRCLE_PAYMASTER_ADDRESS || DEFAULTS.paymasterAddress;
  const dryRun = asBoolean(values.RAW_ERC4337_DRY_RUN, true);

  const validationFlags: string[] = [];
  if (!(entryPointVersion === "v0.8" || entryPointVersion === "v0.7")) {
    validationFlags.push("entrypoint_version_invalid_expected_v0.8_or_v0.7");
  }
  if (isPresent(entryPointAddress) && !isHexAddress(entryPointAddress)) {
    validationFlags.push("entrypoint_address_invalid");
  }
  if (isPresent(paymasterAddress) && !isHexAddress(paymasterAddress)) {
    validationFlags.push("paymaster_address_invalid");
  }
  if (!dryRun) {
    validationFlags.push("dry_run_false_forbidden_in_this_sprint");
  }

  const blockers: string[] = [];
  if (!isPresent(values.ARC_BUNDLER_RPC_URL)) blockers.push("missing bundler");
  if (!isPresent(entryPointAddress)) blockers.push("missing EntryPoint");
  blockers.push("no signing path");

  console.log("\n[defaults]");
  console.log(`chainId=${DEFAULTS.chainId}`);
  console.log(`rpc=${DEFAULTS.rpc}`);
  console.log(`paymasterVersion=${DEFAULTS.paymasterVersion}`);
  console.log(`paymasterAddress=${DEFAULTS.paymasterAddress}`);
  console.log(`expectedAccountPath=${DEFAULTS.expectedAccountPath}`);
  console.log(`proofPath=${DEFAULTS.proofPath}`);

  console.log("\n[env_presence]");
  for (const key of REQUIRED_ENV_KEYS) {
    console.log(`${key}=${isPresent(values[key]) ? "present" : "missing"}`);
  }

  console.log("\n[summary]");
  console.log(`presentCount=${present.length}`);
  console.log(`missingCount=${missing.length}`);
  if (missing.length > 0) console.log(`missingKeys=${missing.join(",")}`);
  if (validationFlags.length > 0) console.log(`validationFlags=${validationFlags.join(",")}`);

  console.log("\n[blockers]");
  for (const blocker of blockers) {
    console.log(`- ${blocker}`);
  }

  console.log("\n[classification]");
  console.log("FEASIBLE_PAYMASTER_DATA_LOCAL_PERMIT_PATH");
  console.log("FEASIBLE_BUT_NEEDS_7702_ACCOUNT_PATH");
  console.log("FEASIBLE_BUT_NEEDS_BUNDLER_RPC");
  console.log("FEASIBLE_BUT_NEEDS_PERMIT_SIGNING_DRY_RUN");
  console.log("DO_NOT_CLAIM");

  console.log("\n[status]");
  console.log("paymasterStatus=NOT_CLAIMED");
  console.log("gaslessStatus=NOT_CLAIMED");
}

main();
