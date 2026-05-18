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

function getSignMessage(): string {
  const value = process.env.CIRCLE_SIGN_MESSAGE?.trim();
  if (!value) {
    return "AgentPay Circle Wallets signing proof on ARC-TESTNET";
  }

  if (isPlaceholder(value)) {
    throw new Error("CIRCLE_SIGN_MESSAGE appears to be a placeholder. Set a real message or leave it unset.");
  }

  return value;
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

async function main(): Promise<void> {
  console.log("[circle-wallets] sign message proof (server-only, no funds movement)");

  const apiKey = getRequiredEnv("CIRCLE_API_KEY");
  const entitySecret = getRequiredEnv("CIRCLE_ENTITY_SECRET");
  const walletId = getRequiredEnv("CIRCLE_WALLET_ID");
  const message = getSignMessage();

  const client = initiateDeveloperControlledWalletsClient({
    apiKey,
    entitySecret,
  });

  try {
    const response = await client.signMessage({
      walletId,
      message,
    });

    const data = response.data as Record<string, unknown> | undefined;
    const status = typeof response.status === "number" ? response.status : undefined;
    const signature = typeof data?.signature === "string" ? data.signature : undefined;
    const signatureId = typeof data?.id === "string" ? data.id : undefined;
    const operationId =
      typeof data?.operationId === "string"
        ? data.operationId
        : typeof data?.requestId === "string"
          ? data.requestId
          : typeof data?.idempotencyKey === "string"
            ? data.idempotencyKey
            : undefined;
    const state = typeof data?.state === "string" ? data.state : undefined;

    console.log("[circle-wallets] message signing succeeded.");
    console.log(`walletId=${walletId}`);
    console.log(`message=${message}`);

    if (signature) {
      console.log(`signature=${signature}`);
    } else if (signatureId) {
      console.log(`signatureId=${signatureId}`);
    } else {
      throw new Error("Sign message response missing signature/signatureId proof fields");
    }

    if (operationId) {
      console.log(`operationId=${operationId}`);
    }

    if (state) {
      console.log(`state=${state}`);
    }

    if (status !== undefined) {
      console.log(`status=${status}`);
    }
  } catch (error) {
    console.error("[circle-wallets] message signing failed.");
    console.error(errorMessage(error));
    throw error;
  }
}

void main();