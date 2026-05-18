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

function getDryRunFlag(): boolean {
  const value = process.env.CIRCLE_WALLET_TRANSFER_DRY_RUN?.trim() ?? "true";
  return value.toLowerCase() !== "false";
}

function getTokenIdOrFail(): string {
  const tokenId = process.env.CIRCLE_WALLET_TRANSFER_TOKEN_ID?.trim() ?? "";

  if (!tokenId || isPlaceholder(tokenId)) {
    throw new Error("CIRCLE_WALLET_TRANSFER_TOKEN_ID is required; do not guess token id.");
  }

  return tokenId;
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

async function main(): Promise<void> {
  console.log("[circle-wallets] estimate transfer fee (server-only, non-mutating)");

  const apiKey = getRequiredEnv("CIRCLE_API_KEY");
  const entitySecret = getRequiredEnv("CIRCLE_ENTITY_SECRET");
  const walletId = getRequiredEnv("CIRCLE_WALLET_ID");
  const destinationAddress = getRequiredEnv("CIRCLE_WALLET_TRANSFER_DESTINATION");
  const amount = getRequiredEnv("CIRCLE_WALLET_TRANSFER_AMOUNT");
  const tokenId = getTokenIdOrFail();
  const dryRun = getDryRunFlag();

  if (!dryRun) {
    console.log("[circle-wallets] CIRCLE_WALLET_TRANSFER_DRY_RUN=false was provided.");
    console.log("[circle-wallets] safety override: this script is estimate-only and will not create/send/sign transactions.");
  }

  const client = initiateDeveloperControlledWalletsClient({
    apiKey,
    entitySecret,
  });

  try {
    const response = await client.estimateTransferFee({
      walletId,
      destinationAddress,
      amount: [amount],
      tokenId,
    });

    if (!response.data) {
      throw new Error("Transfer estimate API returned no data");
    }

    console.log("[circle-wallets] transfer estimate succeeded.");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    const message = errorMessage(error);
    console.error("[circle-wallets] transfer estimate failed.");
    console.error(message);

    if (/insufficient|not enough funds|higher than the balance|failed to execute this request/i.test(message)) {
      console.error("[circle-wallets] likely cause: wallet funding is required before this transfer path can be estimated.");
    }

    if (/unsupported|not supported/i.test(message)) {
      console.error("[circle-wallets] likely cause: requested transfer estimate path is unsupported for current wallet/token/network setup.");
    }

    throw error;
  }
}

void main();
