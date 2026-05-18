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

async function main(): Promise<void> {
  console.log("[circle-wallets] get wallet metadata (server-only, non-mutating)");

  const apiKey = getRequiredEnv("CIRCLE_API_KEY");
  const entitySecret = getRequiredEnv("CIRCLE_ENTITY_SECRET");
  const walletId = getRequiredEnv("CIRCLE_WALLET_ID");

  const client = initiateDeveloperControlledWalletsClient({
    apiKey,
    entitySecret,
  });

  const response = await client.getWallet({ id: walletId });
  const wallet = response.data?.wallet;
  const walletExtra = wallet as unknown as Record<string, unknown>;

  if (!wallet?.id || !wallet?.address || !wallet?.blockchain) {
    throw new Error("Wallet lookup response missing required wallet proof fields");
  }

  console.log("[circle-wallets] wallet metadata fetched.");
  console.log(`walletId=${wallet.id}`);
  console.log(`address=${wallet.address}`);
  console.log(`blockchain=${wallet.blockchain}`);

  if (wallet.walletSetId) {
    console.log(`walletSetId=${wallet.walletSetId}`);
  }

  if (typeof walletExtra.accountType === "string") {
    console.log(`accountType=${walletExtra.accountType}`);
  }

  if (wallet.custodyType) {
    console.log(`custodyType=${wallet.custodyType}`);
  }

  if (wallet.state) {
    console.log(`state=${wallet.state}`);
  }
}

void main();
