import { defineChain, isAddress } from "viem";
import { entryPoint07Address, entryPoint08Address } from "viem/account-abstraction";

type AllowedEnvKey =
  | "ARC_BUNDLER_RPC_URL"
  | "RAW_ERC4337_ENTRYPOINT_VERSION"
  | "RAW_ERC4337_ENTRYPOINT_ADDRESS"
  | "RAW_ERC4337_DRY_RUN"
  | "CIRCLE_PAYMASTER_ADDRESS";

const ALLOWED_ENV_KEYS: AllowedEnvKey[] = [
  "ARC_BUNDLER_RPC_URL",
  "RAW_ERC4337_ENTRYPOINT_VERSION",
  "RAW_ERC4337_ENTRYPOINT_ADDRESS",
  "RAW_ERC4337_DRY_RUN",
  "CIRCLE_PAYMASTER_ADDRESS",
];

const DEFAULTS = {
  entryPointVersion: "v0.8",
  dryRun: true,
  paymasterAddress: "0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966",
} as const;

const ENTRYPOINT_BY_VERSION = {
  "v0.8": entryPoint08Address,
  "v0.7": entryPoint07Address,
} as const;

const arcTestnet = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.arc.network"],
    },
    public: {
      http: ["https://rpc.testnet.arc.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "ArcScan",
      url: "https://testnet.arcscan.app",
    },
  },
  testnet: true,
});

function readEnv(key: AllowedEnvKey): string {
  return process.env[key]?.trim() ?? "";
}

function parseDryRun(value: string): boolean {
  if (!value) return DEFAULTS.dryRun;
  return value.toLowerCase() !== "false";
}

function isPresent(value: string): boolean {
  return value.length > 0;
}

function main(): void {
  console.log("[circle-paymaster-v08-7702-bundler-readiness] mode=SERVER_ONLY_DRY_RUN");
  console.log("networkCalls=false");
  console.log("signing=false");
  console.log("userOps=false");
  console.log("transactions=false");

  const env = Object.fromEntries(ALLOWED_ENV_KEYS.map((key) => [key, readEnv(key)])) as Record<
    AllowedEnvKey,
    string
  >;

  const entryPointVersionRaw = env.RAW_ERC4337_ENTRYPOINT_VERSION || DEFAULTS.entryPointVersion;
  if (!(entryPointVersionRaw === "v0.8" || entryPointVersionRaw === "v0.7")) {
    throw new Error("RAW_ERC4337_ENTRYPOINT_VERSION must be v0.8 or v0.7");
  }
  const entryPointVersion = entryPointVersionRaw as keyof typeof ENTRYPOINT_BY_VERSION;

  const dryRun = parseDryRun(env.RAW_ERC4337_DRY_RUN);
  if (!dryRun) {
    throw new Error("RAW_ERC4337_DRY_RUN must be true in this readiness sprint");
  }

  const entryPointFromEnv = env.RAW_ERC4337_ENTRYPOINT_ADDRESS;
  if (isPresent(entryPointFromEnv) && !isAddress(entryPointFromEnv)) {
    throw new Error("RAW_ERC4337_ENTRYPOINT_ADDRESS must be a valid EVM address when provided");
  }

  const resolvedEntryPoint = isPresent(entryPointFromEnv)
    ? entryPointFromEnv
    : ENTRYPOINT_BY_VERSION[entryPointVersion];
  const entryPointSource = isPresent(entryPointFromEnv) ? "env" : "viem_constant";

  const paymasterAddress = env.CIRCLE_PAYMASTER_ADDRESS || DEFAULTS.paymasterAddress;
  if (!isAddress(paymasterAddress)) {
    throw new Error("CIRCLE_PAYMASTER_ADDRESS must be a valid EVM address");
  }

  const hasBundler = isPresent(env.ARC_BUNDLER_RPC_URL);

  console.log("\n[arc_testnet_chain]");
  console.log(`chainId=${arcTestnet.id}`);
  console.log(`rpc=${arcTestnet.rpcUrls.default.http[0]}`);
  console.log(`explorer=${arcTestnet.blockExplorers?.default.url ?? "unknown"}`);
  console.log(`nativeCurrency=${arcTestnet.nativeCurrency.symbol}`);

  console.log("\n[entrypoint]");
  console.log(`version=${entryPointVersion}`);
  console.log(`address=${resolvedEntryPoint}`);
  console.log(`source=${entryPointSource}`);
  console.log(`entryPoint07Address=${entryPoint07Address}`);
  console.log(`entryPoint08Address=${entryPoint08Address}`);

  console.log("\n[env]");
  console.log(`ARC_BUNDLER_RPC_URL_PRESENT=${hasBundler ? "yes" : "no"}`);
  console.log(`RAW_ERC4337_DRY_RUN=${dryRun}`);
  console.log(`CIRCLE_PAYMASTER_ADDRESS=${paymasterAddress}`);

  console.log("\n[blockers]");
  if (!hasBundler) {
    console.log("BLOCKED_NO_BUNDLER");
  } else {
    console.log("none_for_readiness_phase");
  }

  console.log("\n[status]");
  console.log("networkCalls=false");
  console.log("signing=false");
  console.log("userOps=false");
  console.log("transactions=false");
  console.log("paymasterStatus=NOT_CLAIMED");
  console.log("gaslessStatus=NOT_CLAIMED");
}

main();