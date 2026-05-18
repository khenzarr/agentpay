import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const PLACEHOLDER_TOKENS = ["BURAYA", "PLACEHOLDER", "TODO", "YOUR_", "CHANGE_ME", "example"];

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

function isDryRunEnabled(value: string): boolean {
  return value.toLowerCase() !== "false";
}

async function main(): Promise<void> {
  console.log("[circle-wallets] create Arc Testnet wallet (server-only)");

  const apiKey = getRequiredEnv("CIRCLE_API_KEY");
  const entitySecret = getRequiredEnv("CIRCLE_ENTITY_SECRET");
  const blockchain = getRequiredEnv("CIRCLE_TESTNET_BLOCKCHAIN");
  const dryRunRaw = getRequiredEnv("CIRCLE_WALLETS_DRY_RUN");
  const walletSetName = getOptionalEnv("CIRCLE_WALLET_SET_NAME", "AgentPay Arc Testnet Wallet Set");
  const accountType = getOptionalEnv("CIRCLE_WALLET_ACCOUNT_TYPE", "EOA");
  const configuredWalletSetId = getOptionalWalletSetId();

  if (blockchain !== "ARC-TESTNET") {
    throw new Error(`CIRCLE_TESTNET_BLOCKCHAIN must be ARC-TESTNET. Received: ${blockchain}`);
  }

  if (accountType !== "EOA") {
    throw new Error(`CIRCLE_WALLET_ACCOUNT_TYPE must be EOA. Received: ${accountType}`);
  }

  const dryRun = isDryRunEnabled(dryRunRaw);

  if (dryRun) {
    console.log("[circle-wallets] dry-run enabled; no Circle API mutations will be performed.");
    console.log("[circle-wallets] intended params:");
    if (configuredWalletSetId) {
      console.log(`- walletSetId: ${configuredWalletSetId}`);
    } else {
      console.log("- walletSetId: not provided; live mode would create a new wallet set.");
    }
    console.log(`- walletSetName: ${walletSetName}`);
    console.log(`- blockchains: [\"${blockchain}\"]`);
    console.log("- count: 1");
    console.log(`- accountType: ${accountType}`);
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
    accountType: "EOA",
  });

  const wallet = walletsResponse.data?.wallets?.[0];

  if (!wallet?.id || !wallet?.address || !wallet?.blockchain) {
    throw new Error("Wallet creation response missing wallet proof fields");
  }

  console.log("[circle-wallets] wallet creation succeeded.");
  console.log(`walletSetId=${walletSetId}`);
  console.log(`walletId=${wallet.id}`);
  console.log(`walletAddress=${wallet.address}`);
  console.log(`blockchain=${wallet.blockchain}`);
}

void main();
