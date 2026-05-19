import { createPublicClient, defineChain, formatUnits, http, isAddress, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export {};

const ARC_CHAIN_ID = 5042002;
const ARC_RPC_URL = "https://rpc.testnet.arc.network";

type RequiredEnvKey =
  | "PAYMASTER_7702_OWNER_PRIVATE_KEY"
  | "PAYMASTER_7702_OWNER_EXPECTED_ADDRESS"
  | "CIRCLE_PAYMASTER_ADDRESS"
  | "CIRCLE_PAYMASTER_USDC_ADDRESS"
  | "CIRCLE_PAYMASTER_PERMIT_AMOUNT"
  | "CIRCLE_PAYMASTER_PERMIT_DEADLINE_SECONDS";

const REQUIRED_ENV_KEYS: RequiredEnvKey[] = [
  "PAYMASTER_7702_OWNER_PRIVATE_KEY",
  "PAYMASTER_7702_OWNER_EXPECTED_ADDRESS",
  "CIRCLE_PAYMASTER_ADDRESS",
  "CIRCLE_PAYMASTER_USDC_ADDRESS",
  "CIRCLE_PAYMASTER_PERMIT_AMOUNT",
  "CIRCLE_PAYMASTER_PERMIT_DEADLINE_SECONDS",
];

const ERC20_ABI = [
  {
    type: "function",
    name: "name",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "nonces",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

const ERC20_VERSION_ABI = [
  {
    type: "function",
    name: "version",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
] as const;

function readEnv(key: RequiredEnvKey): string {
  return process.env[key]?.trim() ?? "";
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function isValidPrivateKey(value: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(value);
}

function parsePositiveInteger(value: string, key: string): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${key} must be a positive integer`);
  }
  return parsed;
}

async function main(): Promise<void> {
  console.log("[circle-paymaster-v08-permit-input-readiness] mode=SERVER_ONLY_READINESS");
  console.log("signing=false");
  console.log("userOps=false");
  console.log("transactions=false");
  console.log("approvals=false");
  console.log("permitSigningRequired=true");
  console.log("permitSigningExecuted=false");

  const env = Object.fromEntries(REQUIRED_ENV_KEYS.map((key) => [key, readEnv(key)])) as Record<
    RequiredEnvKey,
    string
  >;

  for (const key of REQUIRED_ENV_KEYS) {
    assert(env[key].length > 0, `Missing required env: ${key}`);
  }

  assert(isValidPrivateKey(env.PAYMASTER_7702_OWNER_PRIVATE_KEY), "PAYMASTER_7702_OWNER_PRIVATE_KEY format invalid");
  assert(
    isAddress(env.PAYMASTER_7702_OWNER_EXPECTED_ADDRESS),
    "PAYMASTER_7702_OWNER_EXPECTED_ADDRESS must be a valid EVM address",
  );
  assert(isAddress(env.CIRCLE_PAYMASTER_ADDRESS), "CIRCLE_PAYMASTER_ADDRESS must be a valid EVM address");
  assert(
    isAddress(env.CIRCLE_PAYMASTER_USDC_ADDRESS),
    "CIRCLE_PAYMASTER_USDC_ADDRESS must be a valid EVM address",
  );

  const ownerAccount = privateKeyToAccount(env.PAYMASTER_7702_OWNER_PRIVATE_KEY as `0x${string}`);
  const ownerAddress = ownerAccount.address;
  const expectedAddressMatched =
    ownerAddress.toLowerCase() === env.PAYMASTER_7702_OWNER_EXPECTED_ADDRESS.toLowerCase();
  assert(expectedAddressMatched, "Derived owner address does not match PAYMASTER_7702_OWNER_EXPECTED_ADDRESS");

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

  const publicClient = createPublicClient({
    chain: arcTestnet,
    transport: http(ARC_RPC_URL),
  });

  const usdcAddress = env.CIRCLE_PAYMASTER_USDC_ADDRESS as `0x${string}`;
  const paymasterAddress = env.CIRCLE_PAYMASTER_ADDRESS as `0x${string}`;

  const tokenName = await publicClient.readContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: "name",
  });
  const tokenDecimals = await publicClient.readContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: "decimals",
  });
  const permitNonce = await publicClient.readContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: "nonces",
    args: [ownerAddress],
  });
  const ownerBalance = await publicClient.readContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [ownerAddress],
  });
  const currentAllowanceToPaymaster = await publicClient.readContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [ownerAddress, paymasterAddress],
  });

  let tokenVersion = "unavailable";
  try {
    tokenVersion = await publicClient.readContract({
      address: usdcAddress,
      abi: ERC20_VERSION_ABI,
      functionName: "version",
    });
  } catch {
    tokenVersion = "unavailable";
  }

  const permitDeadlineSeconds = parsePositiveInteger(
    env.CIRCLE_PAYMASTER_PERMIT_DEADLINE_SECONDS,
    "CIRCLE_PAYMASTER_PERMIT_DEADLINE_SECONDS",
  );
  const suggestedDeadline = Math.floor(Date.now() / 1000) + permitDeadlineSeconds;
  const suggestedPermitAmountRaw = parseUnits(env.CIRCLE_PAYMASTER_PERMIT_AMOUNT, Number(tokenDecimals));

  console.log(`ownerAddress=${ownerAddress}`);
  console.log(`expectedAddressMatched=${expectedAddressMatched ? "yes" : "no"}`);
  console.log(`usdcAddress=${usdcAddress}`);
  console.log(`paymasterAddress=${paymasterAddress}`);
  console.log(`chainId=${ARC_CHAIN_ID}`);
  console.log(`tokenName=${tokenName}`);
  console.log(`tokenDecimals=${tokenDecimals}`);
  console.log(`version=${tokenVersion}`);
  console.log(`permitNonce=${permitNonce}`);
  console.log(`ownerBalance=${ownerBalance}`);
  console.log(`ownerBalanceFormatted=${formatUnits(ownerBalance, Number(tokenDecimals))}`);
  console.log(`currentAllowanceToPaymaster=${currentAllowanceToPaymaster}`);
  console.log(
    `currentAllowanceToPaymasterFormatted=${formatUnits(currentAllowanceToPaymaster, Number(tokenDecimals))}`,
  );
  console.log(`suggestedPermitAmount=${env.CIRCLE_PAYMASTER_PERMIT_AMOUNT}`);
  console.log(`suggestedPermitAmountRaw=${suggestedPermitAmountRaw}`);
  console.log(`suggestedDeadline=${suggestedDeadline}`);
  console.log(`permitSpender=${paymasterAddress}`);
  console.log(`permitVerifyingContract=${usdcAddress}`);
  console.log("permitSigningRequired=true");
  console.log("permitSigningExecuted=false");
  console.log("userOps=false");
  console.log("transactions=false");
  console.log("paymasterStatus=NOT_CLAIMED");
  console.log("gaslessStatus=NOT_CLAIMED");
}

void main();