import { createPublicClient, defineChain, encodePacked, formatUnits, http, isAddress, parseUnits } from "viem";
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
    name: "nonces",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
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
  console.log("[circle-paymaster-v08-permit-signature-dry-run] mode=SERVER_ONLY_LOCAL_SIGNATURE_DRY_RUN");
  console.log("permitSigningExecuted=false");
  console.log("userOps=false");
  console.log("transactions=false");
  console.log("approvals=false");

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
  const nonce = await publicClient.readContract({
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

  let tokenVersion = "2";
  try {
    tokenVersion = await publicClient.readContract({
      address: usdcAddress,
      abi: ERC20_VERSION_ABI,
      functionName: "version",
    });
  } catch {
    tokenVersion = "2";
  }

  const deadlineSeconds = parsePositiveInteger(
    env.CIRCLE_PAYMASTER_PERMIT_DEADLINE_SECONDS,
    "CIRCLE_PAYMASTER_PERMIT_DEADLINE_SECONDS",
  );
  const deadline = BigInt(Math.floor(Date.now() / 1000) + deadlineSeconds);
  const valueRaw = parseUnits(env.CIRCLE_PAYMASTER_PERMIT_AMOUNT, Number(tokenDecimals));

  const permitTypes = {
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  } as const;

  const permitSignature = await ownerAccount.signTypedData({
    domain: {
      name: tokenName,
      version: tokenVersion,
      chainId: ARC_CHAIN_ID,
      verifyingContract: usdcAddress,
    },
    types: permitTypes,
    primaryType: "Permit",
    message: {
      owner: ownerAddress,
      spender: paymasterAddress,
      value: valueRaw,
      nonce,
      deadline,
    },
  });

  const paymasterData = encodePacked(
    ["uint8", "address", "uint256", "bytes"],
    [0, usdcAddress, valueRaw, permitSignature],
  );

  console.log("localSignatureOnly=true");
  console.log("offlinePermitSignature=true");
  console.log(`ownerAddress=${ownerAddress}`);
  console.log(`expectedAddressMatched=${expectedAddressMatched ? "yes" : "no"}`);
  console.log(`tokenName=${tokenName}`);
  console.log(`tokenVersion=${tokenVersion}`);
  console.log(`tokenDecimals=${tokenDecimals}`);
  console.log(`nonce=${nonce}`);
  console.log(`ownerBalance=${ownerBalance}`);
  console.log(`ownerBalanceFormatted=${formatUnits(ownerBalance, Number(tokenDecimals))}`);
  console.log(`currentAllowanceToPaymaster=${currentAllowanceToPaymaster}`);
  console.log(
    `currentAllowanceToPaymasterFormatted=${formatUnits(currentAllowanceToPaymaster, Number(tokenDecimals))}`,
  );
  console.log(`valueRaw=${valueRaw}`);
  console.log(`deadline=${deadline}`);
  console.log(`spender=${paymasterAddress}`);
  console.log(`verifyingContract=${usdcAddress}`);
  console.log("signaturePresent=yes");
  console.log(`signatureLength=${permitSignature.length}`);
  console.log(`signaturePrefix=${permitSignature.slice(0, 10)}`);
  console.log("permitSigningExecuted=true");
  console.log("userOps=false");
  console.log("transactions=false");
  console.log("approvals=false");
  console.log("paymasterStatus=NOT_CLAIMED");
  console.log("gaslessStatus=NOT_CLAIMED");

  console.log("paymasterDataEncoded=yes");
  console.log(`paymasterDataLength=${paymasterData.length}`);
  console.log(`paymasterDataPrefix=${paymasterData.slice(0, 18)}`);
  console.log(`paymasterAddress=${paymasterAddress}`);
  console.log("paymasterVerificationGasLimitCandidate=unresolved");
  console.log("paymasterPostOpGasLimitCandidate=unresolved");
  console.log("isFinalCandidate=true");
}

void main();
