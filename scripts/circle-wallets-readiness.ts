type ReadinessKey = {
  key: string;
  required: boolean;
  secret: boolean;
};

const readinessKeys: ReadinessKey[] = [
  { key: "CIRCLE_API_KEY", required: true, secret: true },
  { key: "CIRCLE_ENTITY_SECRET", required: true, secret: true },
  { key: "CIRCLE_ENTITY_SECRET_CIPHERTEXT", required: true, secret: true },
  { key: "CIRCLE_WALLET_SET_ID", required: false, secret: false },
  { key: "CIRCLE_TESTNET_BLOCKCHAIN", required: true, secret: false },
  { key: "CIRCLE_WALLETS_DRY_RUN", required: false, secret: false },
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

  if (hasErrors) {
    throw new Error(
      "Circle Wallets readiness failed. Fill required server-only vars in .env.circle.local and re-run.",
    );
  }

  console.log("[circle-wallets-readiness] readiness checks passed");
  console.log(
    "[circle-wallets-readiness] Circle Wallets remains NOT_CLAIMED until real wallet create/sign/send runtime proof is captured.",
  );
}

void main();
