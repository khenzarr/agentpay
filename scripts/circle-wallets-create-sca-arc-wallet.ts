import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const PLACEHOLDER_TOKENS = ["BURAYA", "PLACEHOLDER", "TODO", "YOUR_", "CHANGE_ME", "example"];
const SCA_ACCOUNT_TYPE = "SCA" as const;

function isPlaceholder(value: string): boolean {
  const lowered = value.toLowerCase();
  return PLACEHOLDER_TOKENS.some((token) => lowered.includes(token.toLowerCase()));
}

function getRequiredEnv(key: string): string {
  const value = process.env[key]?.trim() ?? "";

  if (!value) {
    throw new Error(`${key} is required in .env.circle.local`);
  }

  if (isPlaceholder(value)) {
    throw new Error(`${key} appears to be a placeholder. Set a real value in .env.circle.local`);
  }

  return value;
}

function getOptionalEnv(key: string, fallback = ""): string {
  return process.env[key]?.trim() || fallback;
}

function getOptionalWalletSetId(): string {
  const value = getOptionalEnv("CIRCLE_WALLET_SET_ID");
  if (!value || isPlaceholder(value)) {
    return "";
  }

  return value;
}

function isDryRunEnabled(value: string | undefined): boolean {
  if (!value) return true;
  return value.toLowerCase() !== "false";
}

function getWalletCount(value: string | undefined): number {
  if (!value) return 1;

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error("CIRCLE_SCA_WALLET_COUNT must be a positive integer when provided");
  }

  return parsed;
}

async function main(): Promise<void> {
  console.log("[circle-wallets] create SCA Arc Testnet wallet (server-only)");

  const apiKey = getRequiredEnv("CIRCLE_API_KEY");
  const entitySecret = getRequiredEnv("CIRCLE_ENTITY_SECRET");
  const blockchain = getRequiredEnv("CIRCLE_TESTNET_BLOCKCHAIN");
  const dryRun = isDryRunEnabled(process.env.CIRCLE_SCA_WALLET_DRY_RUN);
  const requestedCount = getWalletCount(process.env.CIRCLE_SCA_WALLET_COUNT);
  const configuredWalletSetId = getOptionalWalletSetId();
  const walletSetName = getOptionalEnv("CIRCLE_WALLET_SET_NAME", "AgentPay Arc Testnet Wallet Set");

  if (blockchain !== "ARC-TESTNET") {
    throw new Error(`CIRCLE_TESTNET_BLOCKCHAIN must be ARC-TESTNET. Received: ${blockchain}`);
  }

  if (SCA_ACCOUNT_TYPE !== "SCA") {
    throw new Error("SCA accountType value is not confirmed; refusing live wallet creation.");
  }

  if (dryRun) {
    console.log("[circle-wallets] dry-run enabled; no Circle API mutations will be performed.");
    console.log("[circle-wallets] intended params:");
    console.log(`- accountType: ${SCA_ACCOUNT_TYPE}`);
    console.log(`- blockchains: [\"${blockchain}\"]`);
    if (configuredWalletSetId) {
      console.log(`- walletSetId: ${configuredWalletSetId}`);
    } else {
      console.log("- walletSetId: not provided; live mode would create a new wallet set.");
    }
    console.log(`- requestedCount: ${requestedCount}`);
    console.log("- liveModeCount: 1 (hard-gated)");
    return;
  }

  const client = initiateDeveloperControlledWalletsClient({
    apiKey,
    entitySecret,
  });

  let walletSetId = configuredWalletSetId;

  if (!walletSetId) {
    const walletSetResponse = await client.createWalletSet({ name: walletSetName });
    walletSetId = walletSetResponse.data?.walletSet?.id ?? "";

    if (!walletSetId) {
      throw new Error("Wallet set creation did not return a walletSet.id");
    }
  }

  const walletsResponse = await client.createWallets({
    walletSetId,
    blockchains: ["ARC-TESTNET"],
    count: 1,
    accountType: "SCA",
  });

  const wallet = walletsResponse.data?.wallets?.[0];

  if (!wallet?.id || !wallet?.address || !wallet?.blockchain) {
    throw new Error("Wallet creation response missing wallet proof fields");
  }

  console.log("[circle-wallets] SCA wallet creation succeeded.");
  console.log(`walletSetId=${walletSetId}`);
  console.log(`walletId=${wallet.id}`);
  console.log(`walletAddress=${wallet.address}`);
  console.log(`blockchain=${wallet.blockchain}`);
 console.log(`accountType=${SCA_ACCOUNT_TYPE}`);
 console.log(`state=${wallet.state ?? "UNKNOWN"}`);
  console.log("responseStatus=success");
}

void main();