export {};

const SCA_ACCOUNT_TYPE = "UNCONFIRMED_RUNTIME_ENUM";

const ARC_PAYMASTER = {
  "v0.7": "0x31BE08D380A21fc740883c0BC434FcFc88740b58",
  "v0.8": "0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966",
} as const;

const PLACEHOLDER_TOKENS = ["BURAYA", "PLACEHOLDER", "TODO", "YOUR_", "CHANGE_ME", "example"];

function redact(value: string): string {
  if (!value) return "<empty>";
  if (value.length <= 8) return "<redacted>";
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function isPlaceholder(value: string): boolean {
  const lowered = value.toLowerCase();
  return PLACEHOLDER_TOKENS.some((token) => lowered.includes(token.toLowerCase()));
}

function getRequiredEnv(key: string): string {
  const value = process.env[key]?.trim() ?? "";
  if (!value) throw new Error(`${key} is required in .env.circle.local`);
  if (isPlaceholder(value)) throw new Error(`${key} appears to be a placeholder value`);
  return value;
}

function getOptionalEnv(key: string): string {
  return process.env[key]?.trim() ?? "";
}

function normalizeBoolean(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback;
  return value.toLowerCase() !== "false";
}

function assertHexAddress(value: string, key: string): void {
  if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
    throw new Error(`${key} must be a valid 20-byte hex address`);
  }
}

async function main(): Promise<void> {
  console.log("[circle-sca-paymaster-readiness] server-only readiness preflight");
  console.log("[circle-sca-paymaster-readiness] non-mutating mode: no wallet creation, no userOp send, no sponsored tx");

  const apiKey = getRequiredEnv("CIRCLE_API_KEY");
  const entitySecret = getRequiredEnv("CIRCLE_ENTITY_SECRET");
  const blockchain = getRequiredEnv("CIRCLE_TESTNET_BLOCKCHAIN");

  if (blockchain !== "ARC-TESTNET") {
    throw new Error(`CIRCLE_TESTNET_BLOCKCHAIN must be ARC-TESTNET. Received: ${blockchain}`);
  }

  const paymasterVersion = (getOptionalEnv("CIRCLE_PAYMASTER_VERSION") || "v0.8") as "v0.7" | "v0.8";
  if (!(paymasterVersion in ARC_PAYMASTER)) {
    throw new Error(`CIRCLE_PAYMASTER_VERSION must be v0.7 or v0.8. Received: ${paymasterVersion}`);
  }

  const defaultAddress = ARC_PAYMASTER[paymasterVersion];
  const configuredAddress = getOptionalEnv("CIRCLE_PAYMASTER_ADDRESS") || defaultAddress;
  assertHexAddress(configuredAddress, "CIRCLE_PAYMASTER_ADDRESS");

  const envScaWalletId = getOptionalEnv("CIRCLE_SCA_WALLET_ID");
  const envScaWalletAddress = getOptionalEnv("CIRCLE_SCA_WALLET_ADDRESS");
  const gaslessDryRun = normalizeBoolean(process.env.CIRCLE_GASLESS_DRY_RUN, true);

  if (envScaWalletAddress) assertHexAddress(envScaWalletAddress, "CIRCLE_SCA_WALLET_ADDRESS");

  const normalizedConfigured = configuredAddress.toLowerCase();
  const normalizedExpected = defaultAddress.toLowerCase();
  const paymasterAddressMatchesDocs = normalizedConfigured === normalizedExpected;

  const readinessFlags: string[] = [];
  readinessFlags.push("baseline_env_ok");
  readinessFlags.push(`sdk_account_type_sca_value=${SCA_ACCOUNT_TYPE}`);
  readinessFlags.push("no_mutation_api_called");

  if (!envScaWalletId) readinessFlags.push("sca_wallet_id_missing_expected_for_future_proof_sprint");
  if (!envScaWalletAddress) readinessFlags.push("sca_wallet_address_missing_expected_for_future_proof_sprint");
  if (!paymasterAddressMatchesDocs) readinessFlags.push("configured_paymaster_address_differs_from_docs_default_for_version");

  console.log(`apiKey=present(${redact(apiKey)})`);
  console.log(`entitySecret=present(${redact(entitySecret)})`);
  console.log(`blockchain=${blockchain}`);
  console.log(`paymasterVersion=${paymasterVersion}`);
  console.log(`paymasterAddressConfigured=${configuredAddress}`);
  console.log(`paymasterAddressDocsDefault=${defaultAddress}`);
  console.log(`paymasterAddressMatchesDocs=${paymasterAddressMatchesDocs ? "true" : "false"}`);
  console.log(`CIRCLE_SCA_WALLET_ID_present=${envScaWalletId ? "yes" : "no"}`);
  console.log(`CIRCLE_SCA_WALLET_ADDRESS_present=${envScaWalletAddress ? "yes" : "no"}`);
  console.log(`CIRCLE_GASLESS_DRY_RUN=${gaslessDryRun ? "true" : "false"}`);

  console.log("recommendedPath=Circle Wallets SCA first; fallback raw ERC-4337 (viem) for explicit userOp/paymaster evidence");
  console.log("entryPointRecommendation=v0.8 default, fallback v0.7 if runtime compatibility blocks v0.8");
  console.log(`readinessVerdict=READINESS_ONLY_NOT_VERIFIED (${readinessFlags.join(",")})`);
  console.log("gaslessStatus=NOT_CLAIMED");
  console.log("paymasterStatus=NOT_CLAIMED");
}

void main();
