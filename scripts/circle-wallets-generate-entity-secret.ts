import { generateEntitySecret } from "@circle-fin/developer-controlled-wallets";

async function main(): Promise<void> {
  console.log("[circle-wallets] generate entity secret (local-only)");
  console.log("⚠️  SENSITIVE: This Entity Secret is a production credential.");
  console.log("- Store it in your password manager immediately.");
  console.log("- Add it only to .env.circle.local as CIRCLE_ENTITY_SECRET.");
  console.log("- Never paste it in chat.");
  console.log("- Never commit it.");
  console.log("- Never place it in NEXT_PUBLIC_* or client code.");

  const entitySecret = generateEntitySecret();

  console.log("\nCIRCLE_ENTITY_SECRET (print-once output):");
  console.log(entitySecret);
}

void main();
