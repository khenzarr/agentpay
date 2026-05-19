import {
  createPublicClient,
  defineChain,
  encodeFunctionData,
  encodePacked,
  http,
  isAddress,
  parseUnits,
} from "viem";
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
const DEFAULT_TRANSFER_AMOUNT = "0.001";

type RequiredEnvKey =
  | "PAYMASTER_7702_OWNER_PRIVATE_KEY"
  | "PAYMASTER_7702_OWNER_EXPECTED_ADDRESS"
  | "ARC_BUNDLER_RPC_URL"
  | "RAW_ERC4337_DRY_RUN"
  | "CIRCLE_PAYMASTER_ADDRESS"
  | "CIRCLE_PAYMASTER_USDC_ADDRESS";

const REQUIRED_ENV_KEYS: RequiredEnvKey[] = [
  "PAYMASTER_7702_OWNER_PRIVATE_KEY",
  "PAYMASTER_7702_OWNER_EXPECTED_ADDRESS",
  "ARC_BUNDLER_RPC_URL",
  "RAW_ERC4337_DRY_RUN",
  "CIRCLE_PAYMASTER_ADDRESS",
  "CIRCLE_PAYMASTER_USDC_ADDRESS",
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

const ERC20_TRANSFER_ABI = [
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

function readEnv(key: RequiredEnvKey): string {
  return process.env[key]?.trim() ?? "";
}

function readOptionalEnv(key: string): string {
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

async function main(): Promise<void> {
  console.log("[circle-paymaster-v08-userop-assembly-dry-run] mode=SERVER_ONLY_FULL_USEROP_ASSEMBLY_DRY_RUN");
  console.log("sendUserOperationCalled=false");
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
  assert(parseStrictTrue(env.RAW_ERC4337_DRY_RUN), "RAW_ERC4337_DRY_RUN must be true");

  const ownerAccount = privateKeyToAccount(env.PAYMASTER_7702_OWNER_PRIVATE_KEY as `0x${string}`);
  const ownerAddress = ownerAccount.address;
  const expectedAddressMatched =
    ownerAddress.toLowerCase() === env.PAYMASTER_7702_OWNER_EXPECTED_ADDRESS.toLowerCase();
  assert(expectedAddressMatched, "Derived owner address does not match PAYMASTER_7702_OWNER_EXPECTED_ADDRESS");

  const transferToRaw = readOptionalEnv("CIRCLE_PAYMASTER_TEST_TRANSFER_TO");
  const transferTo = transferToRaw.length > 0 ? transferToRaw : ownerAddress;
  assert(isAddress(transferTo), "CIRCLE_PAYMASTER_TEST_TRANSFER_TO must be a valid EVM address when provided");

  const transferAmount = readOptionalEnv("CIRCLE_PAYMASTER_TEST_TRANSFER_AMOUNT") || DEFAULT_TRANSFER_AMOUNT;

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

  createBundlerClient({
    chain: arcTestnet,
    transport: http(env.ARC_BUNDLER_RPC_URL),
  });

  await toSimple7702SmartAccount({
    client: publicClient,
    owner: ownerAccount,
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

  const transferAmountRaw = parseUnits(transferAmount, Number(tokenDecimals));
  const permitAmountRaw = parseUnits("0.01", Number(tokenDecimals));
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);

  const transferCalldata = encodeFunctionData({
    abi: ERC20_TRANSFER_ABI,
    functionName: "transfer",
    args: [transferTo as `0x${string}`, transferAmountRaw],
  });

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
      value: permitAmountRaw,
      nonce,
      deadline,
    },
  });

  const paymasterData = encodePacked(
    ["uint8", "address", "uint256", "bytes"],
    [0, usdcAddress, permitAmountRaw, permitSignature],
  );

  console.log(`ownerAddress=${ownerAddress}`);
  console.log(`expectedAddressMatched=${expectedAddressMatched ? "yes" : "no"}`);
  console.log("smartAccountConstruction=success");
  console.log(`transferTo=${transferTo}`);
  console.log(`transferAmount=${transferAmount}`);
  console.log(`transferAmountRaw=${transferAmountRaw}`);
  console.log(`transferCalldataPresent=${transferCalldata.length > 2 ? "yes" : "no"}`);
  console.log("permitSignaturePresent=yes");
  console.log(`permitSignatureLength=${permitSignature.length}`);
  console.log("paymasterDataEncoded=yes");
  console.log(`paymasterDataLength=${paymasterData.length}`);
  console.log(`paymasterAddress=${paymasterAddress}`);
  console.log(`entryPointVersion=${ENTRYPOINT_VERSION}`);
  console.log(`entryPointAddress=${entryPoint08Address}`);
  console.log(`bundlerUrlPresent=${env.ARC_BUNDLER_RPC_URL ? "yes" : "no"}`);
  console.log("userOperationRequestObject=not_constructed_to_avoid_submission");
  console.log("userOpAssemblyStatus=DRY_RUN_READY_NO_SUBMISSION");
  console.log("signingExecuted=permit_only_local");
  console.log("sendUserOperationCalled=false");
  console.log("transactions=false");
  console.log("approvals=false");
  console.log("paymasterStatus=NOT_CLAIMED");
  console.log("gaslessStatus=NOT_CLAIMED");
}

void main();