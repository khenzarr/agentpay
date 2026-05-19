import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import { randomUUID } from "node:crypto";

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

function isDryRunEnabled(): boolean {
  const value = getRequiredEnv("CIRCLE_WALLET_TRANSFER_DRY_RUN");
  return value.toLowerCase() !== "false";
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

async function main(): Promise<void> {
  console.log("[circle-wallets] tiny transfer (server-only, approval-gated)");

  const apiKey = getRequiredEnv("CIRCLE_API_KEY");
  const entitySecret = getRequiredEnv("CIRCLE_ENTITY_SECRET");
  const walletId = getRequiredEnv("CIRCLE_WALLET_ID");
  const tokenId = getRequiredEnv("CIRCLE_WALLET_TRANSFER_TOKEN_ID");
  const destinationAddress = getRequiredEnv("CIRCLE_WALLET_TRANSFER_DESTINATION");
  const amount = getRequiredEnv("CIRCLE_WALLET_TRANSFER_AMOUNT");
  const dryRun = isDryRunEnabled();

  console.log(`walletId=${walletId}`);
  console.log(`destinationAddress=${destinationAddress}`);
  console.log(`tokenId=${tokenId}`);
  console.log(`amount=${amount}`);

  if (dryRun) {
    console.log("DRY RUN ENABLED. No live transfer executed.");
    return;
  }

  const client = initiateDeveloperControlledWalletsClient({
    apiKey,
    entitySecret,
  });

  try {
    const response = await client.createTransaction({
      walletId,
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

    const txId = typeof data?.id === "string" ? data.id : undefined;
    const txState = typeof data?.state === "string" ? data.state : undefined;
    const txHash = typeof data?.txHash === "string" ? data.txHash : undefined;
    const sourceWalletId = typeof data?.walletId === "string" ? data.walletId : walletId;
    const sourceAddress = typeof data?.sourceAddress === "string" ? data.sourceAddress : undefined;
    const destination = typeof data?.destinationAddress === "string" ? data.destinationAddress : destinationAddress;
    const token = typeof data?.tokenId === "string" ? data.tokenId : tokenId;
    const tokenSymbol = typeof data?.symbol === "string" ? data.symbol : undefined;
    const blockchain = typeof data?.blockchain === "string" ? data.blockchain : "ARC-TESTNET";
    const amountOut = Array.isArray(data?.amounts) && typeof data.amounts[0] === "string" ? data.amounts[0] : amount;

    console.log("[circle-wallets] live tiny transfer submitted.");

    if (txId) {
      console.log(`transactionId=${txId}`);
    }

    if (txState) {
      console.log(`state=${txState}`);
    }

    if (txHash) {
      console.log(`txHash=${txHash}`);
    }

    console.log(`sourceWalletId=${sourceWalletId}`);

    if (sourceAddress) {
      console.log(`sourceAddress=${sourceAddress}`);
    }

    console.log(`destinationAddress=${destination}`);
    console.log(`tokenId=${token}`);

    if (tokenSymbol) {
      console.log(`tokenSymbol=${tokenSymbol}`);
    }

    console.log(`amount=${amountOut}`);
    console.log(`blockchain=${blockchain}`);

    if (status !== undefined) {
      console.log(`status=${status}`);
    }
  } catch (error) {
    console.error("[circle-wallets] tiny transfer failed.");
    console.error(errorMessage(error));
    throw error;
  }
}

void main();