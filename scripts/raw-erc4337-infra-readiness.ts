export {};

type RequiredEnvKey =
  | "ARC_BUNDLER_RPC_URL"
  | "CIRCLE_PAYMASTER_SERVICE_URL"
  | "RAW_ERC4337_ENTRYPOINT_VERSION"
  | "RAW_ERC4337_ENTRYPOINT_ADDRESS"
  | "RAW_ERC4337_DRY_RUN"
  | "RAW_ERC4337_PROVIDER_NAME"
  | "RAW_ERC4337_USEROP_SIGNING_PATH"
  | "CIRCLE_SCA_WALLET_ID"
  | "CIRCLE_SCA_WALLET_ADDRESS"
  | "CIRCLE_PAYMASTER_ADDRESS";

const REQUIRED_ENV_KEYS: RequiredEnvKey[] = [
  "ARC_BUNDLER_RPC_URL",
  "CIRCLE_PAYMASTER_SERVICE_URL",
  "RAW_ERC4337_ENTRYPOINT_VERSION",
  "RAW_ERC4337_ENTRYPOINT_ADDRESS",
  "RAW_ERC4337_DRY_RUN",
  "RAW_ERC4337_PROVIDER_NAME",
  "RAW_ERC4337_USEROP_SIGNING_PATH",
  "CIRCLE_SCA_WALLET_ID",
  "CIRCLE_SCA_WALLET_ADDRESS",
  "CIRCLE_PAYMASTER_ADDRESS",
];

const ARC_PAYMASTER = {
  "v0.8": "0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966",
  "v0.7": "0x31BE08D380A21fc740883c0BC434FcFc88740b58",
} as const;

const VIEM_ENTRYPOINT = {
  "v0.8": "0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108",
  "v0.7": "0x0000000071727De22E5E9d8BAf0edAc6f37da032",
} as const;

function readEnv(key: string): string {
  return process.env[key]?.trim() ?? "";
}

function isPresent(value: string): boolean {
  return value.length > 0;
}

function asBoolean(value: string, fallback: boolean): boolean {
  if (!value) return fallback;
  return value.toLowerCase() !== "false";
}

function isHexAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

function main(): void {
  console.log("[raw-erc4337-infra-readiness] mode=NON_MUTATING_ENV_ONLY");
  console.log("networkCalls=false");
  console.log("userOpSubmission=false");
  console.log("sponsoredOps=false");

  const values = Object.fromEntries(REQUIRED_ENV_KEYS.map((key) => [key, readEnv(key)])) as Record<RequiredEnvKey, string>;

  const present = REQUIRED_ENV_KEYS.filter((key) => isPresent(values[key]));
  const missing = REQUIRED_ENV_KEYS.filter((key) => !isPresent(values[key]));

  const entryPointVersion = (values.RAW_ERC4337_ENTRYPOINT_VERSION || "v0.8") as "v0.8" | "v0.7";
  const validEntrypointVersion = entryPointVersion === "v0.8" || entryPointVersion === "v0.7";
  const recommendedPaymasterAddress = validEntrypointVersion ? ARC_PAYMASTER[entryPointVersion] : ARC_PAYMASTER["v0.8"];
  const recommendedEntryPointAddress = validEntrypointVersion ? VIEM_ENTRYPOINT[entryPointVersion] : VIEM_ENTRYPOINT["v0.8"];

  const checks: string[] = [];

  if (!validEntrypointVersion) checks.push("entrypoint_version_invalid_expected_v0.8_or_v0.7");
  if (values.RAW_ERC4337_ENTRYPOINT_ADDRESS && !isHexAddress(values.RAW_ERC4337_ENTRYPOINT_ADDRESS)) {
    checks.push("entrypoint_address_invalid");
  }
  if (values.CIRCLE_PAYMASTER_ADDRESS && !isHexAddress(values.CIRCLE_PAYMASTER_ADDRESS)) {
    checks.push("paymaster_address_invalid");
  }
  if (values.CIRCLE_SCA_WALLET_ADDRESS && !isHexAddress(values.CIRCLE_SCA_WALLET_ADDRESS)) {
    checks.push("sca_wallet_address_invalid");
  }

  const dryRun = asBoolean(values.RAW_ERC4337_DRY_RUN, true);
  if (!dryRun) checks.push("dry_run_false_forbidden_in_readiness_sprint");

  const missingCritical = [
    "ARC_BUNDLER_RPC_URL",
    "CIRCLE_PAYMASTER_SERVICE_URL",
    "RAW_ERC4337_ENTRYPOINT_ADDRESS",
  ].filter((key) => !isPresent(values[key as RequiredEnvKey]));

  console.log("\n[presence]");
  for (const key of REQUIRED_ENV_KEYS) {
    console.log(`${key}=${isPresent(values[key]) ? "present" : "missing"}`);
  }

  console.log("\n[recommendations]");
  console.log("recommendedPaymasterVersion=v0.8");
  console.log(`recommendedPaymasterAddress_v0.8=${ARC_PAYMASTER["v0.8"]}`);
  console.log(`recommendedPaymasterAddress_v0.7=${ARC_PAYMASTER["v0.7"]}`);
  console.log(`recommendedPaymasterAddressForSelectedVersion=${recommendedPaymasterAddress}`);
  console.log(`recommendedEntryPointAddress=${recommendedEntryPointAddress}`);

  console.log("\n[summary]");
  console.log(`presentCount=${present.length}`);
  console.log(`missingCount=${missing.length}`);
  if (missing.length > 0) console.log(`missingKeys=${missing.join(",")}`);
  if (checks.length > 0) console.log(`validationFlags=${checks.join(",")}`);
  if (missingCritical.length > 0) console.log(`criticalMissing=${missingCritical.join(",")}`);

  const hasBundler = isPresent(values.ARC_BUNDLER_RPC_URL);
  const hasPaymasterService = isPresent(values.CIRCLE_PAYMASTER_SERVICE_URL);
  const hasCircleScaMetadata = isPresent(values.CIRCLE_SCA_WALLET_ID) && isPresent(values.CIRCLE_SCA_WALLET_ADDRESS);
  const hasUserOpSigningPath = isPresent(values.RAW_ERC4337_USEROP_SIGNING_PATH);

  const classifications: string[] = [];
  if (!hasBundler) classifications.push("BLOCKED_NO_BUNDLER");
  if (!hasPaymasterService) classifications.push("BLOCKED_NO_PAYMASTER_DATA_PATH");
  if (!(hasCircleScaMetadata && hasUserOpSigningPath)) classifications.push("BLOCKED_CIRCLE_SCA_RAW_COMPATIBILITY");
  classifications.push("FEASIBLE_BUT_NEEDS_PROVIDER_ACCOUNT");
  classifications.push("DO_NOT_CLAIM");

  console.log("\n[verdict]");
  console.log(`readinessVerdict=${classifications.join(" | ")}`);
  console.log("paymasterStatus=NOT_CLAIMED");
  console.log("gaslessStatus=NOT_CLAIMED");
}

main();
