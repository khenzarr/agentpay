import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import { randomUUID } from "node:crypto";

const ARC_PAYMASTER = {
  "v0.7": "0x31BE08D380A21fc740883c0BC434FcFc88740b58",
  "v0.8": "0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966",
} as const;

const PLACEHOLDER_TOKENS = ["BURAYA", "PLACEHOLDER", "TODO", "YOUR_", "CHANGE_ME", "example"];

const SENSITIVE_KEYS = [
  "apikey",
  "entitysecret",
  "entitysecretciphertext",
  "authorization",
  "x-api-key",
  "password",
  "token",
  "secret",
  "cipher",
];
const MAX_TEXT_LENGTH = 500;
const MAX_DEPTH = 2;

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

function redactText(value: string): string {
  return value.slice(0, MAX_TEXT_LENGTH);
}

function sanitizeValue(value: unknown, depth = 0): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") return redactText(value);
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (depth >= MAX_DEPTH) return "[TRUNCATED]";

  if (Array.isArray(value)) {
    return value.slice(0, 5).map((item) => sanitizeValue(item, depth + 1));
  }

  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (SENSITIVE_KEYS.some((sensitive) => key.toLowerCase().includes(sensitive))) {
        out[key] = "[REDACTED]";
      } else {
        out[key] = sanitizeValue(nested, depth + 1);
      }
    }
    return out;
  }

  return redactText(String(value));
}

function sanitizeError(error: unknown): Record<string, unknown> {
  const err = error as Record<string, unknown>;
  const response = err.response as Record<string, unknown> | undefined;
  const request = err.request as Record<string, unknown> | undefined;
  const config =
    (err.config as Record<string, unknown> | undefined) ??
    (response?.config as Record<string, unknown> | undefined) ??
    request;

  return {
    errorName: typeof err.name === "string" ? err.name : error instanceof Error ? error.name : "Error",
    errorMessage: typeof err.message === "string" ? redactText(err.message) : "Unknown error",
    ...(typeof err.code === "string" || typeof err.code === "number" ? { errorCode: err.code } : {}),
    ...(typeof response?.status === "number" ? { httpStatus: response.status } : {}),
    ...(typeof config?.method === "string" ? { method: config.method.toUpperCase() } : {}),
    ...(typeof config?.url === "string" ? { url: redactText(config.url) } : {}),
    ...(response?.data !== undefined ? { responseData: sanitizeValue(response.data) } : {}),
  };
}

function logSanitizedError(error: unknown): void {
  const payload = sanitizeError(error);
  for (const [key, value] of Object.entries(payload)) {
    console.error(`${key}=${typeof value === "string" ? value : JSON.stringify(value)}`);
  }
  console.error("paymasterProofCaptured=false");
  console.error("userOpHashPresent=false");
  console.error("txHashPresent=false");
  console.error("paymasterStatus=NOT_CLAIMED");
  console.error("gaslessStatus=NOT_CLAIMED");
}

async function main(): Promise<void> {
  console.log("[circle-paymaster] sponsored transfer readiness (server-only, safety-gated)");

  const apiKey = getRequiredEnv("CIRCLE_API_KEY");
  const entitySecret = getRequiredEnv("CIRCLE_ENTITY_SECRET");
  const scaWalletId = getRequiredEnv("CIRCLE_SCA_WALLET_ID");
  const scaWalletAddress = getRequiredEnv("CIRCLE_SCA_WALLET_ADDRESS");
  const blockchain = getRequiredEnv("CIRCLE_TESTNET_BLOCKCHAIN");
  const tokenId = getRequiredEnv("CIRCLE_WALLET_TRANSFER_TOKEN_ID");
  const destinationAddress = getRequiredEnv("CIRCLE_WALLET_TRANSFER_DESTINATION");
  const amount = getRequiredEnv("CIRCLE_WALLET_TRANSFER_AMOUNT");

  if (blockchain !== "ARC-TESTNET") {
    throw new Error(`CIRCLE_TESTNET_BLOCKCHAIN must be ARC-TESTNET. Received: ${blockchain}`);
  }

  assertHexAddress(scaWalletAddress, "CIRCLE_SCA_WALLET_ADDRESS");
  assertHexAddress(destinationAddress, "CIRCLE_WALLET_TRANSFER_DESTINATION");

  const paymasterVersion = (getOptionalEnv("CIRCLE_PAYMASTER_VERSION") || "v0.8") as "v0.7" | "v0.8";
  if (!(paymasterVersion in ARC_PAYMASTER)) {
    throw new Error(`CIRCLE_PAYMASTER_VERSION must be v0.7 or v0.8. Received: ${paymasterVersion}`);
  }

  const paymasterAddress = getOptionalEnv("CIRCLE_PAYMASTER_ADDRESS") || ARC_PAYMASTER[paymasterVersion];
  assertHexAddress(paymasterAddress, "CIRCLE_PAYMASTER_ADDRESS");

  const gasStationPolicyId = getOptionalEnv("CIRCLE_GAS_STATION_POLICY_ID");
  const dryRun = normalizeBoolean(process.env.CIRCLE_PAYMASTER_DRY_RUN, true);

  console.log(`dryRun=${dryRun ? "true" : "false"}`);
  console.log(`scaWalletId=${scaWalletId}`);
  console.log(`scaWalletAddress=${scaWalletAddress}`);
  console.log(`blockchain=${blockchain}`);
  console.log(`paymasterVersion=${paymasterVersion}`);
  console.log(`paymasterAddress=${paymasterAddress}`);
  console.log(`tokenId=${tokenId}`);
  console.log(`destinationAddress=${destinationAddress}`);
  console.log(`amount=${amount}`);
  console.log(`gasStationPolicyIdPresent=${gasStationPolicyId ? "yes" : "no"}`);

  if (dryRun) {
    console.log("mode=DRY_RUN_ONLY_NO_MUTATION");
    console.log("proofPath=wallets_sdk_transfer_attempt_with_console_policy_expected");
    console.log("note=Wallets SDK surface does not explicitly expose paymaster/userOp fields in createTransaction response types");
    return;
  }

  console.log("mode=LIVE_SINGLE_TX_ATTEMPT");
  console.log("warning=founder_approval_required_before_setting_CIRCLE_PAYMASTER_DRY_RUN=false");

  const client = initiateDeveloperControlledWalletsClient({ apiKey, entitySecret });

  try {
    const response = await client.createTransaction({
      walletId: scaWalletId,
      destinationAddress,
      amount: [amount],
      tokenId,
      idempotencyKey: randomUUID(),
      fee: {
        type: "level",
        config: {
          feeLevel: "MEDIUM",
        },
      },
    });

    const data = response.data as Record<string, unknown> | undefined;
    const status = typeof response.status === "number" ? response.status : undefined;

    const transactionId = typeof data?.id === "string" ? data.id : undefined;
    const state = typeof data?.state === "string" ? data.state : undefined;
    const txHash = typeof data?.txHash === "string" ? data.txHash : undefined;
    const userOpHash = typeof data?.userOpHash === "string" ? data.userOpHash : undefined;

    if (transactionId) console.log(`transactionId=${transactionId}`);
    if (state) console.log(`state=${state}`);
    if (status !== undefined) console.log(`status=${status}`);
    if (txHash) console.log(`txHash=${txHash}`);
    if (userOpHash) console.log(`userOpHash=${userOpHash}`);

    console.log(`sourceWalletId=${scaWalletId}`);
    console.log(`sourceWalletAddress=${scaWalletAddress}`);
    console.log(`destinationAddress=${destinationAddress}`);
    console.log(`tokenId=${tokenId}`);
    console.log(`amount=${amount}`);
    console.log(`paymasterVersion=${paymasterVersion}`);
    console.log(`paymasterAddress=${paymasterAddress}`);
    console.log(`gasStationPolicyIdPresent=${gasStationPolicyId ? "yes" : "no"}`);
    console.log("sponsorshipEvidence=NOT_EXPLICIT_IN_WALLETS_SDK_RESPONSE_REQUIRES_CONSOLE_ONCHAIN_CORRELATION");
  } catch (error) {
    logSanitizedError(error);
    throw error instanceof Error ? error : new Error("Circle paymaster sponsored transfer failed");
  }
}

void main();
