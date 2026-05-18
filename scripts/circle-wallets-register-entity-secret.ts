import { registerEntitySecretCiphertext } from "@circle-fin/developer-controlled-wallets";
import fs from "node:fs";

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
  console.log("[circle-wallets] register entity secret ciphertext (server-only)");

  const apiKey = getRequiredEnv("CIRCLE_API_KEY");
  const entitySecret = getRequiredEnv("CIRCLE_ENTITY_SECRET");
  const recoveryFileDownloadPath = "./.circle-recovery";

  fs.mkdirSync(recoveryFileDownloadPath, { recursive: true });

  await registerEntitySecretCiphertext({
    apiKey,
    entitySecret,
    recoveryFileDownloadPath,
  });

  console.log("[circle-wallets] entity secret registered successfully.");
  console.log(`[circle-wallets] recovery file output directory: ${recoveryFileDownloadPath}`);
  console.log("[circle-wallets] secure the recovery file and do not commit it.");
}

void main();
