type ReadinessKey = {
  key: string;
  required: boolean;
  secret: boolean;
};

const PLACEHOLDER_TOKENS = ["BURAYA", "PLACEHOLDER", "TODO", "YOUR_", "CHANGE_ME", "example"];

const readinessKeys: ReadinessKey[] = [
  { key: "CIRCLE_API_KEY", required: true, secret: true },
  { key: "CIRCLE_ENTITY_SECRET", required: true, secret: true },
  { key: "CIRCLE_WALLET_SET_ID", required: false, secret: false },
  { key: "CIRCLE_WALLET_SET_NAME", required: false, secret: false },
  { key: "CIRCLE_WALLET_ACCOUNT_TYPE", required: false, secret: false },
  { key: "CIRCLE_TESTNET_BLOCKCHAIN", required: true, secret: false },
  { key: "CIRCLE_WALLETS_DRY_RUN", required: true, secret: false },
];

function redact(value: string): string {
  if (!value) return "<empty>";
  if (value.length <= 8) return "<redacted>";
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function normalizeBoolean(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback;
  return value.toLowerCase() !== "false";
}

function isPlaceholder(value: string): boolean {
  const lowered = value.toLowerCase();
  return PLACEHOLDER_TOKENS.some((token) => lowered.includes(token.toLowerCase()));
}

async function main(): Promise<void> {
  console.log("[circle-wallets-readiness] server-only readiness preflight");
  console.log("[circle-wallets-readiness] no live Circle Wallets mutation calls are performed");

  let hasErrors = false;

  for (const item of readinessKeys) {
    const value = process.env[item.key]?.trim() ?? "";
    const present = value.length > 0;

    if (item.required && !present) {
      hasErrors = true;
      console.log(`- ${item.key}: missing (required)`);
      continue;
    }

    if (!present) {
      console.log(`- ${item.key}: missing (optional)`);
      continue;
    }

    if (item.key === "CIRCLE_WALLET_SET_ID" && isPlaceholder(value)) {
      hasErrors = true;
      console.log(
        "- CIRCLE_WALLET_SET_ID: invalid placeholder value detected (clear it to allow wallet set auto-create, or replace with a real wallet set ID)",
      );
      continue;
    }

    if (isPlaceholder(value)) {
      hasErrors = true;
      console.log(`- ${item.key}: invalid placeholder value detected`);
      continue;
    }

    if (item.secret) {
      console.log(`- ${item.key}: present (${redact(value)})`);
    } else {
      console.log(`- ${item.key}: present (${value})`);
    }
  }

  const blockchain = process.env.CIRCLE_TESTNET_BLOCKCHAIN?.trim();
  if (blockchain !== "ARC-TESTNET") {
    hasErrors = true;
    console.log(
      `- CIRCLE_TESTNET_BLOCKCHAIN check failed: expected ARC-TESTNET, received ${blockchain || "<empty>"}`,
    );
  } else {
    console.log("- CIRCLE_TESTNET_BLOCKCHAIN check passed: ARC-TESTNET");
  }

  const dryRun = normalizeBoolean(process.env.CIRCLE_WALLETS_DRY_RUN, true);
  if (!dryRun) {
    console.log(
      "- CIRCLE_WALLETS_DRY_RUN is false. This script still does not call wallet creation/sign/send APIs.",
    );
  } else {
    console.log("- CIRCLE_WALLETS_DRY_RUN: true");
  }

  const walletSetId = process.env.CIRCLE_WALLET_SET_ID?.trim() ?? "";
  if (!walletSetId) {
    console.log(
      "- CIRCLE_WALLET_SET_ID is optional and currently empty; wallet-create live mode would create/reuse a wallet set automatically.",
    );
  }

  if (hasErrors) {
    throw new Error(
      "Circle Wallets readiness failed. Fill required server-only vars in .env.circle.local and re-run.",
    );
  }

  console.log("[circle-wallets-readiness] readiness checks passed");
  console.log(
    "[circle-wallets-readiness] wallet-creation verification is tracked separately; signing/sending/gasless/paymaster proofs are still required for those claims.",
  );
}

void main();
