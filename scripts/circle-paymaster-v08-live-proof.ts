import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  createPublicClient,
  defineChain,
  encodeFunctionData,
  encodePacked,
  formatUnits,
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
const EXPECTED_PAYMASTER = "0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966";
const EXPECTED_USDC = "0x3600000000000000000000000000000000000000";

type RequiredEnvKey =
  | "PAYMASTER_7702_OWNER_PRIVATE_KEY"
  | "PAYMASTER_7702_OWNER_EXPECTED_ADDRESS"
  | "ARC_BUNDLER_RPC_URL"
  | "RAW_ERC4337_ENTRYPOINT_VERSION"
  | "RAW_ERC4337_DRY_RUN"
  | "CIRCLE_PAYMASTER_ADDRESS"
  | "CIRCLE_PAYMASTER_USDC_ADDRESS"
  | "CIRCLE_PAYMASTER_PERMIT_AMOUNT"
  | "CIRCLE_PAYMASTER_TEST_TRANSFER_AMOUNT"
  | "CIRCLE_PAYMASTER_LIVE_PROOF_APPROVED"
  | "CIRCLE_PAYMASTER_LIVE_PROOF_EXECUTE"
  | "CIRCLE_PAYMASTER_LIVE_PROOF_MAX_ATTEMPTS";

const REQUIRED_ENV_KEYS: RequiredEnvKey[] = [
  "PAYMASTER_7702_OWNER_PRIVATE_KEY",
  "PAYMASTER_7702_OWNER_EXPECTED_ADDRESS",
  "ARC_BUNDLER_RPC_URL",
  "RAW_ERC4337_ENTRYPOINT_VERSION",
  "RAW_ERC4337_DRY_RUN",
  "CIRCLE_PAYMASTER_ADDRESS",
  "CIRCLE_PAYMASTER_USDC_ADDRESS",
  "CIRCLE_PAYMASTER_PERMIT_AMOUNT",
  "CIRCLE_PAYMASTER_TEST_TRANSFER_AMOUNT",
  "CIRCLE_PAYMASTER_LIVE_PROOF_APPROVED",
  "CIRCLE_PAYMASTER_LIVE_PROOF_EXECUTE",
  "CIRCLE_PAYMASTER_LIVE_PROOF_MAX_ATTEMPTS",
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

function nowIso(): string {
  return new Date().toISOString();
}

function timestampForFile(): string {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function sanitizeError(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return String(error);
}

async function main(): Promise<void> {
  console.log("[circle-paymaster-v08-live-proof] mode=CONTROLLED_SINGLE_ATTEMPT_LIVE_PROOF");
  console.log("attemptPolicy=exactly_one");
  console.log("autoRetry=false");

  const env = Object.fromEntries(REQUIRED_ENV_KEYS.map((key) => [key, readEnv(key)])) as Record<
    RequiredEnvKey,
    string
  >;

  for (const key of REQUIRED_ENV_KEYS) {
    assert(env[key].length > 0, `Missing required env: ${key}`);
  }

  if (env.CIRCLE_PAYMASTER_LIVE_PROOF_EXECUTE !== "true") {
    console.log("LIVE_PROOF_BLOCKED_EXECUTE_FLAG_MISSING");
    throw new Error("CIRCLE_PAYMASTER_LIVE_PROOF_EXECUTE must be exactly true");
  }
  if (env.CIRCLE_PAYMASTER_LIVE_PROOF_APPROVED !== "true") {
    console.log("LIVE_PROOF_BLOCKED_APPROVAL_FLAG_MISSING");
    throw new Error("CIRCLE_PAYMASTER_LIVE_PROOF_APPROVED must be exactly true");
  }
  if (env.CIRCLE_PAYMASTER_LIVE_PROOF_MAX_ATTEMPTS !== "1") {
    console.log("LIVE_PROOF_BLOCKED_MAX_ATTEMPTS_NOT_ONE");
    throw new Error("CIRCLE_PAYMASTER_LIVE_PROOF_MAX_ATTEMPTS must be exactly 1");
  }
  assert(env.RAW_ERC4337_ENTRYPOINT_VERSION === ENTRYPOINT_VERSION, "RAW_ERC4337_ENTRYPOINT_VERSION must be v0.8");
  assert(isValidPrivateKey(env.PAYMASTER_7702_OWNER_PRIVATE_KEY), "PAYMASTER_7702_OWNER_PRIVATE_KEY format invalid");
  assert(isAddress(env.PAYMASTER_7702_OWNER_EXPECTED_ADDRESS), "PAYMASTER_7702_OWNER_EXPECTED_ADDRESS must be valid");
  assert(isAddress(env.CIRCLE_PAYMASTER_ADDRESS), "CIRCLE_PAYMASTER_ADDRESS must be valid");
  assert(isAddress(env.CIRCLE_PAYMASTER_USDC_ADDRESS), "CIRCLE_PAYMASTER_USDC_ADDRESS must be valid");
  assert(
    env.CIRCLE_PAYMASTER_ADDRESS.toLowerCase() === EXPECTED_PAYMASTER.toLowerCase(),
    `CIRCLE_PAYMASTER_ADDRESS must equal ${EXPECTED_PAYMASTER}`,
  );
  assert(
    env.CIRCLE_PAYMASTER_USDC_ADDRESS.toLowerCase() === EXPECTED_USDC.toLowerCase(),
    `CIRCLE_PAYMASTER_USDC_ADDRESS must equal ${EXPECTED_USDC}`,
  );

  const ownerAccount = privateKeyToAccount(env.PAYMASTER_7702_OWNER_PRIVATE_KEY as `0x${string}`);
  const ownerAddress = ownerAccount.address;
  const expectedAddressMatched =
    ownerAddress.toLowerCase() === env.PAYMASTER_7702_OWNER_EXPECTED_ADDRESS.toLowerCase();
  assert(expectedAddressMatched, "Derived owner address mismatch");

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

  const bundlerClient = createBundlerClient({
    chain: arcTestnet,
    transport: http(env.ARC_BUNDLER_RPC_URL),
  });

  const networkChainId = await publicClient.getChainId();
  assert(networkChainId === ARC_CHAIN_ID, `Unexpected chainId ${networkChainId}, expected ${ARC_CHAIN_ID}`);
  assert(
    entryPoint08Address.toLowerCase() === "0x4337084d9e255ff0702461cf8895ce9e3b5ff108",
    "entryPoint08Address constant mismatch",
  );

  const account = await toSimple7702SmartAccount({
    client: publicClient,
    owner: ownerAccount,
  });

  const usdcAddress = env.CIRCLE_PAYMASTER_USDC_ADDRESS as `0x${string}`;
  const paymasterAddress = env.CIRCLE_PAYMASTER_ADDRESS as `0x${string}`;
  const transferToRaw = readOptionalEnv("CIRCLE_PAYMASTER_TEST_TRANSFER_TO");
  const transferTo = (transferToRaw || ownerAddress) as `0x${string}`;
  assert(isAddress(transferTo), "CIRCLE_PAYMASTER_TEST_TRANSFER_TO must be a valid address when provided");

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
  const allowance = await publicClient.readContract({
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

  assert(Number(tokenDecimals) === 6, `Unexpected token decimals ${tokenDecimals}, expected 6`);

  const permitAmountRaw = parseUnits(env.CIRCLE_PAYMASTER_PERMIT_AMOUNT, Number(tokenDecimals));
  const transferAmountRaw = parseUnits(env.CIRCLE_PAYMASTER_TEST_TRANSFER_AMOUNT, Number(tokenDecimals));

  assert(permitAmountRaw <= 10000n, "Permit amount exceeds 0.01 USDC bound");
  assert(transferAmountRaw <= 1000n, "Transfer amount exceeds 0.001 USDC bound");
  assert(ownerBalance >= permitAmountRaw, "Owner balance is insufficient for permit amount");

  const transferCalldata = encodeFunctionData({
    abi: ERC20_TRANSFER_ABI,
    functionName: "transfer",
    args: [transferTo, transferAmountRaw],
  });

  const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
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

  let proofStatus = "FAILED_BEFORE_USEROPHASH";
  let userOpHash: string | null = null;
  let txHash: string | null = null;
  let success: boolean | null = null;
  let logsCount = 0;
  let receiptSummary = "unavailable";
  let errorSummary = "none";

  try {
    const hash = await bundlerClient.sendUserOperation({
      account,
      calls: [
        {
          to: usdcAddress,
          data: transferCalldata,
          value: 0n,
        },
      ],
      paymaster: paymasterAddress,
      paymasterData,
      paymasterVerificationGasLimit: 250000n,
      paymasterPostOpGasLimit: 120000n,
      paymasterContext: {
        isFinal: true,
      },
    });

    userOpHash = hash;
    const userOpReceipt = await bundlerClient.waitForUserOperationReceipt({ hash });
    const receipt = userOpReceipt.receipt;

    txHash = receipt.transactionHash;
    success = userOpReceipt.success ?? receipt.status === "success";
    logsCount = receipt.logs.length;
    receiptSummary = JSON.stringify(
      {
        blockNumber: receipt.blockNumber?.toString(),
        status: receipt.status,
        gasUsed: receipt.gasUsed?.toString?.() ?? String(receipt.gasUsed),
        effectiveGasPrice:
          receipt.effectiveGasPrice?.toString?.() ?? String(receipt.effectiveGasPrice ?? "unknown"),
      },
      null,
      2,
    );

    if (userOpHash && txHash && success) {
      proofStatus = "COMPLETE_CANDIDATE_FOR_CLAIM_REVIEW";
    } else {
      proofStatus = "PARTIAL_USEROPHASH_ONLY";
    }
  } catch (error) {
    errorSummary = sanitizeError(error);
    proofStatus = userOpHash ? "PARTIAL_USEROPHASH_ONLY" : "FAILED_BEFORE_USEROPHASH";
  }

  const timestamp = timestampForFile();
  const proofsDir = join("docs", "grant", "agentpay", "proofs");
  mkdirSync(proofsDir, { recursive: true });
  const proofPath = join(proofsDir, `CIRCLE_PAYMASTER_V08_LIVE_PROOF_${timestamp}.md`);

  const markdown = [
    "# Circle Paymaster v0.8 Live Proof Artifact",
    "",
    `- generatedAt: ${nowIso()}`,
    "- network: ARC-TESTNET",
    `- chainId: ${ARC_CHAIN_ID}`,
    `- ownerAddress: ${ownerAddress}`,
    `- expectedAddressMatched: ${expectedAddressMatched ? "yes" : "no"}`,
    `- entryPointVersion: ${ENTRYPOINT_VERSION}`,
    `- entryPointAddress: ${entryPoint08Address}`,
    `- paymasterAddress: ${paymasterAddress}`,
    `- usdcAddress: ${usdcAddress}`,
    `- tokenName: ${tokenName}`,
    `- tokenVersion: ${tokenVersion}`,
    `- tokenDecimals: ${tokenDecimals}`,
    `- ownerBalance: ${ownerBalance}`,
    `- ownerBalanceFormatted: ${formatUnits(ownerBalance, Number(tokenDecimals))}`,
    `- allowanceToPaymaster: ${allowance}`,
    `- permitAmountRaw: ${permitAmountRaw}`,
    `- transferAmountRaw: ${transferAmountRaw}`,
    `- transferTo: ${transferTo}`,
    `- permitSignatureLength: ${permitSignature.length}`,
    `- permitSignaturePrefix: ${permitSignature.slice(0, 10)}`,
    `- paymasterDataLength: ${paymasterData.length}`,
    `- userOpHash: ${userOpHash ?? "N/A"}`,
    `- txHash: ${txHash ?? "N/A"}`,
    `- success: ${success === null ? "unknown" : String(success)}`,
    `- logsCount: ${logsCount}`,
    `- proofStatus: ${proofStatus}`,
    `- errorSummary: ${errorSummary}`,
    "",
    "## Receipt summary",
    "```json",
    receiptSummary,
    "```",
  ].join("\n");

  writeFileSync(proofPath, markdown, "utf8");

  console.log(`ownerAddress=${ownerAddress}`);
  console.log(`expectedAddressMatched=${expectedAddressMatched ? "yes" : "no"}`);
  console.log(`chainId=${ARC_CHAIN_ID}`);
  console.log(`entryPointVersion=${ENTRYPOINT_VERSION}`);
  console.log(`entryPointAddress=${entryPoint08Address}`);
  console.log(`paymasterAddressUsed=${paymasterAddress}`);
  console.log(`transferAmountRaw=${transferAmountRaw}`);
  console.log(`permitAmountRaw=${permitAmountRaw}`);
  console.log(`permitSignatureLength=${permitSignature.length}`);
  console.log(`permitSignaturePrefix=${permitSignature.slice(0, 10)}`);
  console.log(`userOpHash=${userOpHash ?? "N/A"}`);
  console.log(`txHash=${txHash ?? "N/A"}`);
  console.log(`receiptSuccess=${success === null ? "unknown" : String(success)}`);
  console.log(`logsCount=${logsCount}`);
  console.log(`proofStatus=${proofStatus}`);
  console.log(`proofArtifactPath=${proofPath}`);
  console.log(`paymasterStatus=${proofStatus === "COMPLETE_CANDIDATE_FOR_CLAIM_REVIEW" ? "CANDIDATE_FOR_REVIEW" : "NOT_CLAIMED"}`);
  console.log(`gaslessStatus=${proofStatus === "COMPLETE_CANDIDATE_FOR_CLAIM_REVIEW" ? "CANDIDATE_FOR_REVIEW" : "NOT_CLAIMED"}`);

  if (proofStatus !== "COMPLETE_CANDIDATE_FOR_CLAIM_REVIEW") {
    throw new Error(`Live proof did not complete: ${proofStatus}; ${errorSummary}`);
  }
}

void main();
