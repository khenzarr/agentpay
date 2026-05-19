import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const PLACEHOLDER_TOKENS = ["BURAYA", "PLACEHOLDER", "TODO", "YOUR_", "CHANGE_ME", "example"];

function isPlaceholder(value: string): boolean {
  const lowered = value.toLowerCase();
  return PLACEHOLDER_TOKENS.some((token) => lowered.includes(token.toLowerCase()));
}

function getRequiredEnv(key: string): string {
  const value = process.env[key]?.trim() ?? "";
  if (!value) throw new Error(`${key} is required in .env.circle.local`);
  if (isPlaceholder(value)) {
    throw new Error(`${key} appears to be a placeholder. Set a real value in .env.circle.local`);
  }
  return value;
}

function getOptionalEnv(key: string): string {
  return process.env[key]?.trim() ?? "";
}

function normalizeBoolean(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback;
  return value.toLowerCase() !== "false";
}

function redact(value: string): string {
  if (!value) return "<empty>";
  if (value.length <= 8) return "<redacted>";
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

async function main(): Promise<void> {
  console.log("[circle-gas-station-readiness] server-only readiness preflight");
  console.log("[circle-gas-station-readiness] non-mutating mode: no sponsored tx, no transfer, no wallet creation");

  const apiKey = getRequiredEnv("CIRCLE_API_KEY");
  const entitySecret = getRequiredEnv("CIRCLE_ENTITY_SECRET");
  const walletId = getRequiredEnv("CIRCLE_WALLET_ID");
  const blockchain = getRequiredEnv("CIRCLE_TESTNET_BLOCKCHAIN");

  if (blockchain !== "ARC-TESTNET") {
    throw new Error(`CIRCLE_TESTNET_BLOCKCHAIN must be ARC-TESTNET. Received: ${blockchain}`);
  }

  const gasStationPolicyId = getOptionalEnv("CIRCLE_GAS_STATION_POLICY_ID");
  const paymasterPolicyId = getOptionalEnv("CIRCLE_PAYMASTER_POLICY_ID");
  const gaslessDryRun = normalizeBoolean(process.env.CIRCLE_GASLESS_DRY_RUN, true);

  const client = initiateDeveloperControlledWalletsClient({
    apiKey,
    entitySecret,
  });

  const walletResponse = await client.getWallet({ id: walletId });
  const wallet = walletResponse.data?.wallet;
  const walletExtra = wallet as unknown as Record<string, unknown>;

  if (!wallet?.id || !wallet?.address || !wallet?.blockchain) {
    throw new Error("Wallet lookup response missing required wallet fields");
  }

  const accountType = typeof walletExtra.accountType === "string" ? walletExtra.accountType : "<unknown>";
  const custodyType = wallet.custodyType ?? "<unknown>";
  const state = wallet.state ?? "<unknown>";

  console.log(`apiKey=present(${redact(apiKey)})`);
  console.log(`entitySecret=present(${redact(entitySecret)})`);
  console.log(`walletId=${wallet.id}`);
  console.log(`walletAddress=${wallet.address}`);
  console.log(`blockchain=${wallet.blockchain}`);
  console.log(`accountType=${accountType}`);
  console.log(`custodyType=${custodyType}`);
  console.log(`state=${state}`);
  console.log(`CIRCLE_GAS_STATION_POLICY_ID_present=${gasStationPolicyId ? "yes" : "no"}`);
  console.log(`CIRCLE_PAYMASTER_POLICY_ID_present=${paymasterPolicyId ? "yes" : "no"}`);
  console.log(`CIRCLE_GASLESS_DRY_RUN=${gaslessDryRun ? "true" : "false"}`);

  console.log(
    "policyIntrospection=not_implemented_in_this_script (founder-observed Console policy exists: Default Arc Testnet Policy / Active / Arc Testnet / daily spend limit 50 USDC-TESTNET / Sponsored Transactions UI present / settled sponsored txs: 0)",
  );

  const readinessFlags: string[] = [];
  readinessFlags.push("baseline_env_ok");
  readinessFlags.push("wallet_metadata_ok");
  readinessFlags.push("console_policy_observed_by_founder");
  readinessFlags.push("no_live_sponsored_tx_run");

  if (accountType !== "SCA") {
    readinessFlags.push("blocked_eoa_vs_sca_unresolved");
  }

  if (!gasStationPolicyId && !paymasterPolicyId) {
    readinessFlags.push("policy_id_not_configured_in_env_optional_for_now");
  }

  console.log(`readinessVerdict=READINESS_ONLY_NOT_VERIFIED (${readinessFlags.join(",")})`);
  console.log("gaslessStatus=NOT_CLAIMED");
  console.log("paymasterStatus=NOT_CLAIMED");
}

void main();