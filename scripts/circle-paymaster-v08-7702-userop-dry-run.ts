import { createPublicClient, defineChain, http, isAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  createBundlerClient,
  entryPoint08Address,
  toSimple7702SmartAccount,
} from "viem/account-abstraction";

export {};

const ARC_CHAIN_ID = 5042002;
const ARC_RPC_URL = "https://rpc.testnet.arc.network";
const ENTRYPOINT_VERSION = "v0.8";
type RequiredEnvKey =
  | "PAYMASTER_7702_OWNER_PRIVATE_KEY"
  | "PAYMASTER_7702_OWNER_EXPECTED_ADDRESS"
  | "ARC_BUNDLER_RPC_URL"
  | "RAW_ERC4337_DRY_RUN"
  | "RAW_ERC4337_ENTRYPOINT_VERSION"
  | "CIRCLE_PAYMASTER_ADDRESS";

const REQUIRED_ENV_KEYS: RequiredEnvKey[] = [
  "PAYMASTER_7702_OWNER_PRIVATE_KEY",
  "PAYMASTER_7702_OWNER_EXPECTED_ADDRESS",
  "ARC_BUNDLER_RPC_URL",
  "RAW_ERC4337_DRY_RUN",
  "RAW_ERC4337_ENTRYPOINT_VERSION",
  "CIRCLE_PAYMASTER_ADDRESS",
];

function readEnv(key: RequiredEnvKey): string {
  return process.env[key]?.trim() ?? "";
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function isValidPrivateKey(value: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(value);
}

function parseStrictTrue(value: string): boolean {
  return value.toLowerCase() === "true";
}

function buildPaymasterDataBuilderSkeleton(): void {
  console.log("\n[paymaster_data_builder_skeleton]");
  console.log("paymasterDataBuilderStatus=stub_no_signature");
  console.log("permitSigningRequired=true");
  console.log("permitSigningExecuted=false");
  console.log("usdcTokenAddressArcTestnet=REQUIRED_NOT_RESOLVED_IN_DRY_RUN");
  console.log("permitAmount=REQUIRED");
  console.log("permitNonce=REQUIRED");
  console.log("permitDeadline=REQUIRED");
  console.log("permitDomain=REQUIRED");
  console.log("permitSignature=REQUIRED_NOT_GENERATED");
}

async function main(): Promise<void> {
  console.log("[circle-paymaster-v08-7702-userop-dry-run] mode=SERVER_ONLY_DRY_RUN");

  const env = Object.fromEntries(REQUIRED_ENV_KEYS.map((key) => [key, readEnv(key)])) as Record<
    RequiredEnvKey,
    string
  >;

  for (const key of REQUIRED_ENV_KEYS) {
    assert(env[key].length > 0, `Missing required env: ${key}`);
  }

  assert(parseStrictTrue(env.RAW_ERC4337_DRY_RUN), "RAW_ERC4337_DRY_RUN must be true");
  assert(env.RAW_ERC4337_ENTRYPOINT_VERSION === ENTRYPOINT_VERSION, "RAW_ERC4337_ENTRYPOINT_VERSION must be v0.8");
  assert(isValidPrivateKey(env.PAYMASTER_7702_OWNER_PRIVATE_KEY), "PAYMASTER_7702_OWNER_PRIVATE_KEY format invalid");
  assert(
    isAddress(env.PAYMASTER_7702_OWNER_EXPECTED_ADDRESS),
    "PAYMASTER_7702_OWNER_EXPECTED_ADDRESS must be a valid EVM address",
  );
  assert(isAddress(env.CIRCLE_PAYMASTER_ADDRESS), "CIRCLE_PAYMASTER_ADDRESS must be a valid EVM address");

  const ownerAccount = privateKeyToAccount(env.PAYMASTER_7702_OWNER_PRIVATE_KEY as `0x${string}`);
  const ownerAddress = ownerAccount.address;
  const expectedAddressMatched =
    ownerAddress.toLowerCase() === env.PAYMASTER_7702_OWNER_EXPECTED_ADDRESS.toLowerCase();
  assert(
    expectedAddressMatched,
    "Derived owner address does not match PAYMASTER_7702_OWNER_EXPECTED_ADDRESS",
  );

  const arcTestnet = defineChain({
    id: ARC_CHAIN_ID,
    name: "Arc Testnet",
    nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
    rpcUrls: {
      default: { http: [ARC_RPC_URL] },
      public: { http: [ARC_RPC_URL] },
    },
    testnet: true,
  });

  // Hard safety: if any code path tries network during construction, this throws and marks blocker.
  const blockedNetworkFetch: typeof fetch = async () => {
    throw new Error("network_call_blocked_in_dry_run");
  };

  const publicClient = createPublicClient({
    chain: arcTestnet,
    transport: http(ARC_RPC_URL, { fetchFn: blockedNetworkFetch }),
  });

  createBundlerClient({
    chain: arcTestnet,
    transport: http(env.ARC_BUNDLER_RPC_URL, { fetchFn: blockedNetworkFetch }),
    paymaster: {
      async getPaymasterData() {
        throw new Error("paymaster_mutation_blocked_in_dry_run");
      },
    },
  });

  let smartAccountConstruction: "success" | "blocked" = "success";
  let smartAccountConstructionBlocker = "none";

  try {
    await toSimple7702SmartAccount({
      client: publicClient,
      owner: ownerAccount,
    });
  } catch (error) {
    smartAccountConstruction = "blocked";
    smartAccountConstructionBlocker = error instanceof Error ? error.message : "unknown_error";
  }

  console.log(`ownerAddress=${ownerAddress}`);
  console.log(`expectedAddressMatched=${expectedAddressMatched ? "yes" : "no"}`);
  console.log(`chainId=${ARC_CHAIN_ID}`);
  console.log(`entryPointVersion=${ENTRYPOINT_VERSION}`);
  console.log(`entryPointAddress=${entryPoint08Address}`);
  console.log(`paymasterAddress=${env.CIRCLE_PAYMASTER_ADDRESS}`);
  console.log(`bundlerUrlPresent=${env.ARC_BUNDLER_RPC_URL ? "yes" : "no"}`);
  console.log(`smartAccountConstruction=${smartAccountConstruction}`);
  if (smartAccountConstruction === "blocked") {
    console.log(`smartAccountConstructionBlocker=${smartAccountConstructionBlocker}`);
  }
  console.log("signing=false");
  console.log("userOps=false");
  console.log("transactions=false");
  console.log("paymasterStatus=NOT_CLAIMED");
  console.log("gaslessStatus=NOT_CLAIMED");

  buildPaymasterDataBuilderSkeleton();
}

void main();
